rm -rf dist
rm -rf dist.tar.gz
yarn build
tar zcvf dist.tar.gz ./dist
scp ./dist.tar.gz  root@8.222.247.36:~/

