//SPA中用到的常量
const TEXT_CONTENT_STYLE_ROWS = "5";

//SPA中用到的全局变量
var isEditing = false;
var noteArray = new Array();

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        //native相关事件绑定
        document.addEventListener("backbutton", onBackKeyDown, false);

        //native无关事件绑定
        document.getElementById("note-save-button").addEventListener("click",saveNote,true);
        
        //前端布局相关
        document.getElementById("note-content").rows=TEXT_CONTENT_STYLE_ROWS;
  
        updateNotesView();
    }
};

app.initialize();

//应用中绑定的事件处理函数
function onBackKeyDown() {
    if(isEditing) {
        location.reload();
        isEditing = false;
    } else {
        navigator.app.exitApp();
    }
 }

function saveNote(){
    // alert("saveing");
    var note = {};

    note.title = document.getElementById('note-title').value;
    note.content = document.getElementById('note-content').value;
    note.time = new Date();
    noteArray.unshift(note);
    window.localStorage.setItem('noteArray',JSON.stringify(noteArray));
    updateNotesView();
}

//其他函数
//显示window.localStorage中存储的备忘录的信息
function updateNotesView() {
    //从window.localStorage中获取存储的备忘录的信息
    if(JSON.parse(window.localStorage.getItem('noteArray'))!=null) {
        noteArray = JSON.parse(window.localStorage.getItem('noteArray'));
    }
    //显示在前端
    console.log(noteArray);
}


