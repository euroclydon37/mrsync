# mrsync

## Installation
```sh
npm install -g mrsync
```

## Usage

Backup your current directory
```sh
mrsync /path/to/destination
```

Or specify a source directory
```sh
mrsync -s /path/to/source /path/to/destination
```

You can also specify exclusions
```sh
# Comma separated list of items to exclude (not full paths)
mrsync -s /path/to/source -e exclude_one,exclude_two /path/to/destination
```

## Backing up to a remote machine
`mrsync` doesn't prompt for passwords, so if you want to backup to a remote machine, you'll need to have passwordless access to the machine using ssh keys.
```sh
# Create your ssh key pair
ssh-keygen

# Add your id to the server
ssh-copy-id -i /path/to/public_key user@server_address

```

## Contribute
Feel free to submit PRs. I really want to expose as much rsync control as possible. I just started with the options I needed for work.