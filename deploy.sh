git init

git config user.name  "youssifsayed"
git config user.email "sayedgyussif@gmail.com"

git remote add up "https://$GITTOKEN@github.com/youssifsayed/youssifsayed.github.io.git"
git clone https://github.com/youssifsayed/youssifsayed.github.io.git ./
git checkout master

git rm -rf .

echo youssif.me>CNAME
git add -A .
git commit -a -m "New deployment!"

ls

git push -f up master &> /dev/null
