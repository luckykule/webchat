-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- 主机： 127.0.0.1
-- 生成日期： 2021-09-28 02:30:14
-- 服务器版本： 10.4.21-MariaDB
-- PHP 版本： 8.0.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `mychat_db`
--

-- --------------------------------------------------------

--
-- 表的结构 `messages`
--

CREATE TABLE `messages` (
  `id` bigint(20) NOT NULL,
  `msgid` varchar(60) NOT NULL,
  `sender` bigint(20) NOT NULL,
  `receiver` bigint(20) NOT NULL,
  `message` text NOT NULL,
  `files` text DEFAULT NULL,
  `date` datetime NOT NULL,
  `seen` int(11) NOT NULL DEFAULT 0,
  `received` int(11) NOT NULL DEFAULT 0,
  `deleted_sender` tinyint(1) NOT NULL DEFAULT 0,
  `deleted_receiver` tinyint(1) NOT NULL DEFAULT 0,
  `video_request` tinyint(1) NOT NULL DEFAULT -1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- 转存表中的数据 `messages`
--

INSERT INTO `messages` (`id`, `msgid`, `sender`, `receiver`, `message`, `files`, `date`, `seen`, `received`, `deleted_sender`, `deleted_receiver`, `video_request`) VALUES
(1, 'pPDYAwMWawxLShPlwH4XbjWOSzVtaY1lBUBregChkjpDwQ', 4296, 99244, '你好', NULL, '2021-09-11 16:58:42', 1, 1, 0, 1, -1),
(2, 'pPDYAwMWawxLShPlwH4XbjWOSzVtaY1lBUBregChkjpDwQ', 99244, 4296, 'hi', NULL, '2021-09-11 16:58:52', 1, 1, 1, 0, -1),
(3, 'pPDYAwMWawxLShPlwH4XbjWOSzVtaY1lBUBregChkjpDwQ', 4296, 99244, '', 'uploads/cartoon1.jpg', '2021-09-11 16:59:13', 0, 1, 1, 1, -1),
(4, 'qmv2mqXFkoBaqD89MrOf4', 4296, 7897, '你好', NULL, '2021-09-11 17:33:29', 1, 1, 0, 1, -1),
(5, 'qmv2mqXFkoBaqD89MrOf4', 7897, 4296, 'hi', NULL, '2021-09-11 17:33:38', 0, 1, 1, 1, -1),
(6, 'qmv2mqXFkoBaqD89MrOf4', 4296, 7897, '', 'uploads/girl2.jpg', '2021-09-11 17:34:01', 0, 1, 0, 0, -1);

-- --------------------------------------------------------

--
-- 表的结构 `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `userid` bigint(20) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `gender` varchar(6) DEFAULT NULL,
  `password` varchar(64) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `online` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- 转存表中的数据 `users`
--

INSERT INTO `users` (`id`, `userid`, `username`, `email`, `gender`, `password`, `image`, `date`, `online`) VALUES
(1, 99244, 'amen', 'man1@qq.com', 'Male', 'password', 'uploads/man1.jpg', '2021-09-10 16:37:29', 0),
(2, 4296, 'agirl', 'girl1@qq.com', 'Female', 'password', 'uploads/girl1.jpg', '2021-09-10 16:40:13', 0),
(3, 7897, '18xlhe', '18xlhe@stu.edu.cn', 'Male', 'password', 'uploads/man2.jpg', '2021-09-11 05:57:57', 0);

--
-- 转储表的索引
--

--
-- 表的索引 `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender` (`sender`),
  ADD KEY `receiver` (`receiver`),
  ADD KEY `date` (`date`),
  ADD KEY `deleted_sender` (`deleted_sender`),
  ADD KEY `deleted_receiver` (`deleted_receiver`),
  ADD KEY `seen` (`seen`),
  ADD KEY `msgid` (`msgid`),
  ADD KEY `video_request` (`video_request`);

--
-- 表的索引 `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userid` (`userid`),
  ADD KEY `username` (`username`),
  ADD KEY `email` (`email`),
  ADD KEY `gender` (`gender`),
  ADD KEY `date` (`date`),
  ADD KEY `online` (`online`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `messages`
--
ALTER TABLE `messages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- 使用表AUTO_INCREMENT `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
