git init

git config user.name  "youssifsayed"
git config user.email "sayedgyussif@gmail.com"

git fetch --branch=gh-pages https://github.com/youssifsayed/youssifsayed.github.io.git ./
git remote add up "https:/$GITTOKEN@github.com/youssifsayed/youssifsayed.github.io.git"

echo youssif.me>CNAME

git add -A .
git commit -a -m "New deployment!"

ls

git push -q up HEAD:gh-pages