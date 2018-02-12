//SPA中用到的常量
const TEXT_CONTENT_STYLE_ROWS = '5';

//SPA中用到的全局变量
var isEditing = false;
var noteArray = new Array();

//SPA中用到的工具函数
//输入的字符串转义
function escape2HTML(str) {
    return replaceLF(replaceSpecialChar(str));
}
//特殊字符转义
function replaceSpecialChar(str) {
    return str.replace(/"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g,
        function ($0) {
            var c = $0.charCodeAt(0), r = ["&#"];
            c = (c == 0x20) ? 0xA0 : c;
            r.push(c); r.push(";");
            return r.join("");
        });
}

//回车转义
function replaceLF(str) {
    return str.replace(/&#10;/g, '<br>');

}

var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        //native相关事件绑定
        document.addEventListener('backbutton', onBackKeyDown, false);

        //前端布局相关
        document.getElementById('note-content').rows = TEXT_CONTENT_STYLE_ROWS;

        //native无关事件绑定
        document.getElementById('note-save-button').addEventListener('click', saveNote, true);
        document.getElementById('link-delete-note').addEventListener('click', deleteNote, true);
        document.getElementById('link-cancel-delete-note').addEventListener('click', cancelDeleteNote, true);
        //显示ul #show-notes的内容
        updateNotesView();

    }
};

app.initialize();

//应用中绑定的事件处理函数
function onBackKeyDown() {
    if (isEditing) {
        cancelDeleteNote();
    } else {
        navigator.app.exitApp();
    }
}

function saveNote() {
    if (document.getElementById('note-title').value.replace(/(^s*)|(s*$)/g, "").length > 0) {
        // console.log(document.getElementById('note-content').value);
        // console.log(escape2HTML(document.getElementById('note-content').value));
        var note = {};
        note.title = escape2HTML(document.getElementById('note-title').value);
        // console.log(note.title);
        note.content = escape2HTML(document.getElementById('note-content').value);
        // console.log(note.content);
        note.time = new Date();
        noteArray.unshift(note);
        // console.log(noteArray);
        window.localStorage.setItem('noteArray', JSON.stringify(noteArray));
    }


    updateNotesView();
    //清空add-note-model中填写的信息
    document.getElementById('note-title').value = '';
    document.getElementById('note-content').value = '';
}

function deleteNote() {
    isEditing = true;
    document.getElementById('link-delete-note').style.display = 'none';
    document.getElementById('link-cancel-delete-note').style.display = 'block';
    //去除添加的触发作用
    document.getElementById('link-add-note').dataset.toggle = '';
    document.getElementById('link-add-note').dataset.target = '';
    updateNotesView();
    // $('.delete-icon').css('display', 'inline-block');

}

function cancelDeleteNote() {
    isEditing = false;
    // $('.delete-icon').css('display', 'none');
    document.getElementById('link-delete-note').style.display = 'block';
    document.getElementById('link-cancel-delete-note').style.display = 'none';
    //恢复添加的触发作用
    document.getElementById('link-add-note').dataset.toggle = 'modal';
    document.getElementById('link-add-note').dataset.target = '#add-note-model';
    updateNotesView();
}

//其他函数
//显示window.localStorage中存储的备忘录的信息
function updateNotesView() {
    //从window.localStorage中获取存储的备忘录的信息
    if (JSON.parse(window.localStorage.getItem('noteArray')) != null) {
        noteArray = JSON.parse(window.localStorage.getItem('noteArray'));
    }
    //显示在前端
    // console.log(noteArray);
    var divShowNotes = document.getElementById('show-notes');
    //首先，清除已有note列表
    divShowNotes.innerHTML = '';
    var i = 0;
    for (i = 0; i < noteArray.length; i++) {
        //note列表项liNote
        var liNote = document.createElement('li');
        liNote.className = 'list-group-item';

        divShowNotes.appendChild(liNote);
        //删除图标
        var spanDelete = document.createElement('span');
        spanDelete.className = 'delete-icon glyphicon glyphicon-trash';

        liNote.appendChild(spanDelete);
        //标题div
        var spanNoteTitle = document.createElement('span');

        //显示note标题
        spanNoteTitle.innerHTML = noteArray[i].title;
        liNote.appendChild(spanNoteTitle);

        //标题对应时间徽章
        var spanNoteTime = document.createElement('span');
        var tempDate = new Date(Date.parse(noteArray[i].time));
        var timeString = (tempDate.getFullYear()) + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate();
        spanNoteTime.className = 'badge';
        spanNoteTime.innerHTML = timeString;
        liNote.appendChild(spanNoteTime);

        //与当前状态相关的部分
        if (isEditing) {
            spanDelete.style.display = 'inline-block';
        } else {
            liNote.dataset.toggle = 'modal';
            liNote.dataset.target = '#note-detail-model';
            spanDelete.style.display = 'none';
        }


        //绑定点击li发生的事件，此处注意，由于闭包，不立即执行当时的i就会不见，所以立即执行
        (function (temp) {
            liNote.addEventListener('click', function () {
                if (isEditing) {
                    //删除备忘录详情事件

                    //删除记录
                    noteArray.splice(temp, 1);
                    //更新localStorage
                    window.localStorage.setItem('noteArray', JSON.stringify(noteArray));
                    //刷新NotesView
                    updateNotesView();
                } else {
                    //显示备忘录详情事件

                    var note = noteArray[temp];
                    console.log(note);
                    var title = document.getElementById("note-detail-model-title");
                    title.innerHTML = note.title;
                    var content = document.getElementById("note-detail-model-content");
                    content.innerHTML = note.content;
                }
            }, true);
        })(i);
        
    }
}
