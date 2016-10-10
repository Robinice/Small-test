var express = require('express');
var fs = require("fs");
var querystring = require("querystring");
var router = express.Router();

var mysql = require('mysql');

var conn;
function handleError () {
    conn = mysql.createConnection({
	    host: '192.168.1.4',
	    user: 'db_admin',
	    password: '123456',
	    database:'gzcl_db',
	    port: 3306
    });

    //连接错误，2秒重试
    conn.connect(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleError , 2000);
        }
    });

    conn.on('error', function (err) {
        console.log('db error', err);
        // 如果是连接断开，自动重新连接
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleError();
        } else {
            throw err;
        }
    });
}

handleError();


/* GET home page. */
router.get('/', function(req, res, next) {
 /* res.render('index', { title: 'Express' });*/
	res.sendfile('app/index.html');
});

// 获取一个项目信息
router.get('/user/:id', function(req, res, next) {

	conn.query('SELECT id,name from users where id = ' + req.params.id , function(err, rows, fields) {
	    
	    if (err) throw err;

	    if (rows.length > 0) {
	    	res.json({
				code:200,
				data:{
					id: req.params.id,
					name: rows[0].name,
					createTime: rows[0].createTime,
					prize: '6G',
					msg:'领奖成功，恭喜您获得6G广东移动手机流量，将分12个月赠送，每月赠送500M'
				}
			});
		} else {
			res.json({
				code:404,
				msg:'无此数据'
			});			
		}

	});

});

// 添加一个项目信息
router.post('/user', function(req, res, next) {

	if ( !req.body.name || !req.body.num || !req.body.mobile) {
		console.log('error 1');
		res.json({
			code:301,
			msg:'缺少必填参数'
		});
		return;
	}

	var name = req.body.name.trim();
	var num = req.body.num.trim();
	var mobile = req.body.mobile.trim();

	if ( name.length ==0 || num.length ==0 || mobile.length ==0 ) {
		res.json({
			code:301,
			msg:'必填参数不合法'
		});
		return;
	}

	if ( mobile.length != 11 || !isMobile(mobile) ) {
		res.json({
			code:301,
			msg:'手机号码不合法'
		});
		return;
	}

	conn.query('SELECT id from users where num = ? or mobile = ?', [num,mobile] , function(err, rows, fields) {
	    
	    if (err) throw err;

	    if (rows.length == 0) {
	    	
	    	var  sql = 'INSERT INTO users(name,num,mobile,createTime) VALUES(?,?,?,now())';
			var  params = [req.body.name, req.body.num, req.body.mobile];
			//增 add
			conn.query(sql,params,function (err, result) {
		    
		        if(err){
		        	console.log('[INSERT ERROR] - ',err.message);
		        	return;
		        }       
		       	
		       	res.json({
					code:200,
					id:result.insertId,
					msg:'成功保存数据'
				});

			});

		} else {
			res.json({
				code:302,
				msg:'提交数据重复'
			});		
		}

	});

});

function isMobile(string) {  
    var pattern = /^1[34578]\d{9}$/;  
    if (pattern.test(string)) {  
        return true;  
    } 
    return false;  
}; 


String.prototype.trim=function()
{
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

module.exports = router;
