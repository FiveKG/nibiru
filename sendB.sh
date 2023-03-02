#!/bin/bash
passwd="WUgong7758258=-"
name=$1
address=$2
/usr/bin/expect <<-EOF
set timeout 30
spawn nibid tx bank send $name $address 10000000unibi -y --chain-id=nibiru-testnet-1
expect "Enter keyring passphrase:"
send "$passwd\r"
expect eof
EOF
