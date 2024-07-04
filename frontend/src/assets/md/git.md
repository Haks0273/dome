# git

### 1.简单指令



```git & Linus
git config --global user.name git config --global user.name
git config --global user.name git config --global user.email

git init
git status //提交状态

ctrl + y
ctrl + p
ll
ls
pwd //显示路径
cd[]
touch[]
mkdir[] //创建目录
rm[]
clear
```



### 2.Linus指令

```Linus
//1、进入文件 vim 文件名（vim test.txt）
//2、编辑完成之后，按ESC键 跳到命令模式（命令前面冒号是必要的）：
 :w  //保存文件但不退出vi
 :w file //将修改另外保存到file中，不退出vi
 :w!  //强制保存，不推出vi
 :wq //保存文件并退出vi
 :wq! //强制保存文件，并退出vi
 :q //不保存文件，退出vi
 :q! //不保存文件，强制退出vi
 :e! //放弃所有修改，从上次保存文件开始再编辑 
```

### 3.职能

```
git add hello.txt //添加至暂存区
git rm --cached hello.txt //从暂存区移除
$ git commit -m "frist" hello.txt //提交
$ git reflog //查看版本分支
$ git log //查看详细版本分支
```

---

>版本穿梭：

```
$ git reflog
dce8020 (HEAD -> master) HEAD@{0}: commit: scand
3bbf674 HEAD@{1}: commit (initial): frist
——————————————————————————————————————————————
$ git reset --hard 3bbf674
HEAD is now at 3bbf674 hello.txt

```

>分支

```
git branch -v           //查看分支
git branch hot-fix      //创建分支
git checkout hot-fix    //切换分支
git merge hot-fix       //合并分支 
```

>push 和 clone

```
git remote -v
git remote add 项目别名 远程库链接     

git push 项目别名 分支
git pull 项目别名 分支  
git clone 链接
```

