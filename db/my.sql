create table rechat.room
(
    Rid     int         not null comment '群组编号'
        primary key,
    Rname   varchar(50) null comment '群组名称',
    RAvatar varchar(50) null comment '群组头像'
)
    comment '群组';

create table rechat.user
(
    Uid      int         not null comment '账号'
        primary key,
    Uname    varchar(50) null comment '用户名称',
    UAvatar  varchar(50) null comment '用户头像',
    Phone    varchar(50) null comment '电话',
    Password int         null comment '密码'
)
    comment '用户';

create table rechat.belong
(
    Uid int null comment '账号',
    Rid int null comment '群组编号',
    constraint Belong_room_Rid_fk
        foreign key (Rid) references rechat.room (Rid),
    constraint Belong_user_Uid_fk
        foreign key (Uid) references rechat.user (Uid)
)
    comment '群聊成员';

create table rechat.message
(
    Time    datetime     not null comment '时间戳'
        primary key,
    Content varchar(200) null comment '消息内容',
    Uid     int          null comment '消息发出的用户账号',
    Rid     int          null comment '消息发往的群组编号',
    Uname   varchar(50)  null comment '消息发出的用户名字',
    constraint Message_room_Rid_fk
        foreign key (Rid) references rechat.room (Rid),
    constraint Message_user__fk
        foreign key (Uid) references rechat.user (Uid)
)
    comment '消息';

