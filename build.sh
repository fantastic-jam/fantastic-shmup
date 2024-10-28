#!/bin/bash

export NAME=fantastic-shmup

make_love() {
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
        cd lua
        powershell Compress-Archive -Path ".\*" -DestinationPath "../$NAME.zip"
        cd ..
    else
        (cd src && zip -r ../$NAME.zip .)
    fi
    mv $NAME.zip dist/$NAME.love
}

make_win() {
    cat redist/win/love.exe dist/$NAME.love > dist/$NAME.exe
}

make_linux() {
    cat redist/linux/love-appimage dist/$NAME.love > dist/$NAME-appimage
    chmod +x dist/$NAME-appimage
}

make_3ds() {
    cat redist/3ds/lovepotion.3dsx dist/$NAME.love > dist/$NAME.3dsx
}

make_switch() {
    cat redist/switch/lovepotion.nro dist/$NAME.love > dist/$NAME.nro
}

case "$1" in
    "love")
        make_love
        ;;
    "win")
        make_love
        make_win
        ;;
    "linux")
        make_love
        make_linux
        ;;
    "3ds")
        make_love
        make_3ds
        ;;
    "switch")
        make_love
        make_switch
        ;;
    "run")
        love src
        ;;
    "all")
		make_love
		make_win
		make_linux
		make_3ds
		make_switch
        ;;
    *)
        echo "Invalid argument. Use 'love', 'win', 'linux', '3ds', 'switch', 'run', or 'all'."
        ;;
esac
