# Your bash script

# If you have more than 1 enviroment, you distinguish it by the suffix. You need add if suffix by each enviroment
# @example
# if [ $SUFFIX == 'server-php' ]; then
#   something, bash script
# elif [ $SUFFIX == 'client-next' ]; then
#   something, bash script
# else
#   something, bash script
# fi

ENV=${1}
SUFFIX=${2}
WORK_DIR=${3}

echo -e 'abc' >> /home/ubuntu/${WORK_DIR}/abc.txt