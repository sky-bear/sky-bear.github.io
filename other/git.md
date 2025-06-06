# git

<script setup>
import Image from "../components/Image/index.vue"
</script>

GIT 是一个分布式版本控制系统，与 SVN 等集中式版本控制系统不同，GIT 把代码仓库作为客户端保存，每个客户端都保存了完整的代码仓库，所以 GIT 是分布式的。

## 工作流

<Image  src="/other/git/images/git.png" />

## 仓库介绍

- 工作区：作区是你当前正在进行开发和编辑文件的地方。它就是你的项目文件所在的目录，包含你正在修改、编辑、编写的所有文件
- 暂存区：暂存区是工作区与本地仓库之间的一个过渡层，当你修改了工作区的文件，需要通过 git add 命令将修改的文件添加到暂存区，然后通过 git commit 命令将暂存区的文件提交到本地仓库
- 本地仓库：本地仓库是存储在本地计算机上的代码仓库，当你通过 git commit 命令将暂存区的文件提交到本地仓库后，本地仓库会保存你提交的文件，并且会生成一个唯一的 commit id，这个 commit id 是文件的唯一标识
- 远程仓库：远程仓库是存储在远程服务器上的代码仓库，当你通过 git push 命令将本地仓库的文件推送到远程仓库后，远程仓库会保存你推送的文件，并且会生成一个唯一的 commit id，这个 commit id 是文件的唯一标识

## git 常用命令

- config

  - git config --list： 查询当前所有配置

  ```bash
    // 全局更改用户信息
   git config --global user.name "Your Name"
   git config --global user.email "youremail@domain.com"
  ```

- git init: 初始化
- 远程操作
  - git clone： 克隆项目
  - git remote -v 查看远程对应URL
  - git remote add  name url : 指定名称name 为远程url的名称
  - git remote show gitee ：查看远程仓库
  - git remote rename pb paul：将 pb 重命名为 paul
  - git remote remove paul 移除远程仓库
- git pull ：拉去并合并 git fetch +git merge
- git commit -m 提交的描述信息
  - git commit -a -m "xxx": 可以跳过添加到暂存区操作，直接提交，也就是不需要使用 git add
- gut push 推送分支
- git branch -a 展示所有分支
- git banch xx: 创建分支, 并不切换分支
- git barnch -D xx ： 删除 xx 分支
- git checkout xx:切换分支
- git checkout -b xx: 创建并切换新分支 git branch xx + git checkout xx
- git merge xx ： 合并 xx 分支到当前分支
- git merge origin/xx: 合并远程 xx 分支到当前分支
- stash
  - git stash save 备注信息： 暂存修改并增加备注信息
  - git stash apply xxx: 不带 xxx, 默认应用最近的存储， 否则 xxx
  - git stash clear : 清空
  - git stash list: 缓存列表
- git reset
- git log: 查看历史
  - git log --stat ：显示一个提交的总结
- 撤销操作

  - git commit --amend： 提交信息后需要修改 commit, 或者将其他工作区内容添加到当前 commit 中
  - git reset: 撤销工作区内的文件， 不带文件名，撤销所有，带就撤销 xxx
  - git checkout -- 1.js: 将工作区的 1.js 恢复
- git tag: 列出已有标签
- git fetch: 从远程仓库获取最新提交、分支和标签信息，更新本地的远程跟踪分支
- git cherry-pick `<commit-hash> `:允许你将任意分支上的某个或某些特定提交（以 commit hash 标识）的更改应用于当前所在分支，而不是进行完整分支的合并
- .gitignore

```text
# 忽略所有的 .a 文件
*.a

# 但跟踪所有的 lib.a，即便你在前面忽略了 .a 文件
!lib.a

# 只忽略当前目录下的 TODO 文件，而不忽略 subdir/TODO
/TODO

# 忽略任何目录下名为 build 的文件夹
build/

# 忽略 doc/notes.txt，但不忽略 doc/server/arch.txt
doc/*.txt

# 忽略 doc/ 目录及其所有子目录下的 .pdf 文件
doc/**/*.pdf
```


## git rebase 与 git merge 的区别
<Image  src="/other/git/images/rebase-1.jpg" />
<Image  src="/other/git/images/rebase-2.jpg" />
上图是使用git merge 和 git rebase 操作的分支

其中： 分支c 采用merge , 分支 a 采用git rebase

a: 待变基分支， 当前分支
master : 基分支 目标分支
由此我们可以得出：当执行rebase操作时，git会从两个分支的共同祖先开始提取待变基分支上的修改，然后将待变基分支指向基分支的最新提交，最后将刚才提取的修改应用到基分支的最新提交的后面。
通俗的讲：变基就是改变当前分支的基底， 会把基分支的最新提交当作是待变基分支分支的基底， 把待变基分支的其他提交追加到后面（这里的提交已经合并过基分支的哈）


产生的问题：
- 无法查询当前分支是从哪个分支拉出来的
- 合并代码的先后顺序会有问题：
  ```md
  master => a => a => a   a先拉取， 后开发完成
  master => b=> b => b    b后拉取， 先开发完成
  当b开发完成后，回合到master后， 此时如果a执行git rebase操作， a的基底就会变成b 的最新提交。 实际上a 的提交要早于b 
  ```

## 资料引用：

<a href="https://git-scm.com/book/zh/v2/Git-%E5%9F%BA%E7%A1%80-%E8%8E%B7%E5%8F%96-Git-%E4%BB%93%E5%BA%93" target="_blank"  style="display: block">git 命令</a>
