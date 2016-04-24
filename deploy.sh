git init

git config user.name  "youssifsayed"
git config user.email "sayedgyussif@gmail.com"

git remote add up "https://$GITTOKEN@github.com/youssifsayed/youssifsayed.github.io.git"
git fetch upstream && git reset upstream/gh-pages

git rm -rf .
git add -A .

echo youssif.me>CNAME
git commit -a -m "New deployment!"

ls

git push -q up HEAD:gh-pages