#!/bin/bash
passwd="WUgong7758258=-"
name=$1
receive=$2
/usr/bin/expect <<-EOF
set timeout 30
spawn nibid tx bank send $name $receive 1000000000uusdt --from $name -y --chain-id=nibiru-itn-1
expect "Enter keyring passphrase:"
send "$passwd\r"
expect eof
EOF

