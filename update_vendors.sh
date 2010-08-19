#!/bin/sh

cd `dirname $0`
BASEDIR="$(pwd)"

Y="\033[33m"
R="\033[0m"

echo "${Y}Updating submodules ...${R}"
git submodule init && git submodule update

echo "${Y}Updating Express ...${R}"
cd $BASEDIR/support/express && git submodule init && git submodule update

echo "${Y}Updating Mongoose ...${R}"
cd $BASEDIR/support/mongoose && git submodule init && git submodule update
