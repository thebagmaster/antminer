#!/bin/bash
for ip in $(seq 1 254); do ping -c 1 172.20.12.$ip | grep "64 bytes" | cut -d " " -f 4 | tr -d ":" >> ips.txt &  done
