#!usr/bin/env node

const path = require('path')
const readline = require('readline')
const fs = require('fs')
const { spawn } = require('child_process')
const _ = require('lodash')
const currentDir = process.cwd()
let running = false

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const program = require('commander')
  .version(require('../package.json').version)
  .option('-s, --source <src>', 'Directory to be copied')
  .option('-e, --exclude <items>', 'Comma-separated list of top level items to exclude', parseExclusions)
  .arguments('<dest>')
  .action(run)

program.parse(process.argv)

function backup (source, dest, exludeArray) {
  running = true
  const contents = getContents(source)
  const statuses = {}
  _.forEach(contents, item => {
    statuses[item] = { item: item, finished: false }
    let rsync = spawn('rsync', ['-vvrhs', '--size-only', `${source}/${item}`, dest])
    rsync.on('close', code => {
      
    })
  })

  let printStatus = setInterval(() => {
    console.log(statuses)
    if (running = false) {
      clearInterval(printStatus)
    }
  })
}

function getContents (dir) {
  try {
    return fs.readdirSync(dir)
  } catch (error) {
    return 'Error'
  }
}

function parseExclusions (val) {
  return val.split(',')
}

function run (dest) {
  let source = program.source ? program.source : currentDir
  let excludeArray = program.exclude ? program.exclude : null
  if (!dest) { console.log('Please provide a destination directory.') }
  backup(source, dest, excludeArray)
}
