#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const Listr = require('listr')
const Observable = require('rxjs/Observable').Observable
const Rsync = require('rsync')
const _ = require('lodash')
const currentDir = process.cwd()
const errors = []

const program = require('commander')
  .version(require('../package.json').version)
  .option('-s, --source <src>', 'Directory to be copied')
  .option('-e, --exclude <items>', 'Comma-separated list of top level items to exclude', parseExclusions)
  .arguments('<dest>')
  .action(run)

program.parse(process.argv)

function parseExclusions (val) {
  return val.split(',')
}

function getSourceContents (source) {
  try {
    return fs.readdirSync(source)
  } catch (error) {
    let explanation
    switch (error.code) {
      case 'ENOENT':
        explanation = `Directory doesn't exist`
        break
      case 'EACCES':
        explanation = `Permission denied.`
        break
    }
    console.log(error)
    console.log(`Can't ready source directory:`, explanation)
    process.exit(0)
  }
}

function run (dest) {
  let source = program.source ? path.resolve(program.source) : currentDir
  let taskArray = []
  const sourceContents = getSourceContents(source)

  // Assemble list
  _.forEach(sourceContents, item => {
    let srcPath = path.join(source.replace('&', '\\&'), item)
    taskArray.push({
      title: srcPath,
      task: () => transfer(srcPath, dest)
    })
  })

  // Build tasks and run
  const tasks = new Listr(taskArray, { concurrent: true })
  tasks.run()
    .then(() => {
      _.forEach(errors, e => {
        console.log(e)
      })
    })
    .catch(err => {
      console.error(err)
    })
}

function transfer (src, dest) {
  return new Observable(observer => {
    const rsync = Rsync.build({
      source: src,
      destination: dest,
      flags: 'rvvhs',
      shell: 'ssh'
    })
    rsync.set('size-only').set('delete-before')
    rsync.execute(onFinish, onStdOut, onErrOut)

    function onStdOut (data) {
      observer.next(data.toString())
    }

    function onErrOut (data) {
      observer.next(data.toString())
    }

    function onFinish (error, code, cmd) {
      if (error) {
        observer.complete()
        errors.push(`Error with ${cmd}`)
        errors.push(error)
      } else {
        observer.complete()
      }
    }
  })
}
