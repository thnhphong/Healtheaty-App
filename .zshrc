
# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/Users/tothanhphong/opt/anaconda3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/Users/tothanhphong/opt/anaconda3/etc/profile.d/conda.sh" ]; then
        . "/Users/tothanhphong/opt/anaconda3/etc/profile.d/conda.sh"
    else
        export PATH="/Users/tothanhphong/opt/anaconda3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<


export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"
export EXPO_DEBUG=true


# Added by LM Studio CLI (lms)
export PATH="$PATH:/Users/tothanhphong/.lmstudio/bin"
alias home='cd ~'
alias main='python3 main.py'
alias pins='pip install'
alias p='python'
alias p3='python3'
alias p4='python4'
export PATH="/Applications/Docker.app/Contents/Resources/bin:$PATH"

export NVM_DIR="$HOME/.nvm"

[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
