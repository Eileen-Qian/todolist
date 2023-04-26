// const { log } = require('console');
// const { title } = require('process');
const http = require('http');
// 載入外部
const { v4: uuidv4 } = require('uuid');
// 重構 POST API 異常行為，消除重複
const errorHandle = require("./errorHandle");

const todos = [];

const requestListener = (req, res) => {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    };
    let body = "";
    req.on('data', chunk => {
        body += chunk;
    })
    // console.log(req.url);
    // console.log(req.method);
    // console.log(req);

    // 取得所有待辦事項
    if (req.url == '/todos' && req.method == 'GET') {
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            "data": todos
        }));
        res.end();
    }
    // 新增待辦事項
    else if (req.url == '/todos' && req.method == 'POST') {
        req.on('end', () => {
            try {
                const title = JSON.parse(body).title;
                if (title !== undefined) {
                    const todo = {
                        "title": title,
                        "id": uuidv4()
                    };
                    todos.push(todo)
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                        "status": "success",
                        "data": todos
                    }));
                    res.end();
                } else {
                    errorHandle(res);
                }
            } catch (error) {
                errorHandle(res);
            }
        })

    }
    // 刪除所有待辦事項
    else if (req.url == '/todos' && req.method == 'DELETE') {
        todos.length = 0
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            "data": todos,
        }));
        res.end();
    }
    // 刪除單筆待辦事項
    else if (req.url.startsWith('/todos') && req.method == 'DELETE') {
        const id = req.url.split('/').pop();
        const index = todos.findIndex(Element => Element.id === id);
        if (index !== -1) {
            todos.splice(index, 1);
            res.writeHead(200, headers);
            res.write(JSON.stringify({
                "status": "success",
                "data": todos,
            }));
            res.end();
        }else{
            errorHandle(res)
        }
    }
    else if (req.method == "OPTIONS") {
        res.writeHead(200, headers);
        res.end();
    }
    else {
        res.writeHead(404, headers);
        res.write(JSON.stringify({
            "status": "false",
            "message": "找不到路由"
        }));
        res.end();
    }

}

const server = http.createServer(requestListener);
server.listen(3005);