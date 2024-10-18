tmux new-session -d \; send-keys 'cd ./frontend/ && npm run buildwatch' C-m \; split-window -h \; send-keys 'cd ./backend/ && npm run start' C-m \; attach

