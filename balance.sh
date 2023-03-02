#!/bin/bash
/usr/bin/expect <<-EOF
set timeout 30
spawn nibid query bank balances nibi1nhltz0erh8p22kwwulywkhklk2g4p4k9lfvrj3
expect eof
EOF
