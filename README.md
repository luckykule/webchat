# webchat
安装说明：
1.先进行xampp的程序安装和环境搭配，对xampp中的Apache进行端口配置，并将php项目webchat，放入xampp目录htdocs下。
2.进行phpmyadmin的下载安装，然后结合xampp，进行mysql的端口配置，搭建数据库的环境。
3.主程序webchat使用sublime软件进行编辑，而peerjs的程序使用vscode进行运行。
4.在运行peerjs程序之前先要进行npm install，或cnpm install，并进行搭配nodejs环境。
5.进行phpmyadmin数据库的数据建表，数据表需要建立两个，分别为users和messages。
6.运行peerjs程序，执行代码:node peerjs
7.打开运行xampp，运行Apache和mysql，启动成功后，便可运行webchat程序
