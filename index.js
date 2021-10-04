var postArray = [];

var getData = async () => {
    var postArrayString = localStorage.getItem('app-post-array');
    if (postArrayString) {
        postArray = JSON.parse(postArrayString);
    } else {
        postArray = await lodaDataFromServer();
        updateLocalStorage();
    }
    return postArray;
}

function updateLocalStorage() {    
    localStorage.setItem('app-post-array', JSON.stringify(postArray));
}

async function lodaDataFromServer() {
    const api_url = "https://jsonplaceholder.typicode.com/posts";
    const response = await fetch(api_url);
    var data = await response.json();
    return data;
}

async function Initialize() {
    await getData();
    loadTableData();
}

var table;
$(document).ready(async function () {
   await Initialize();
});

function loadTableData() {
    table = $('#tabledata').DataTable({
        language: {
            searchPlaceholder: "Search by Title"
        },
        data: postArray,
        paging: true,
        lengthChange: false,
        headers: ['Id'],
        columns: [
            {
                data: 'id',
                searchable: false
            },
            {
                data: 'userId',
                searchable: false
            },
            {
                display: 'Title',
                data: 'title',
                render: getTruncatedRow
            },
            {
                data: 'body',
                render: getTruncatedRow,
                searchable: false
            },
            {
                data: 'id',
                render: getActionButtons
            }
        ],
        search: {
            search: ""
        }
    });
}

function getActionButtons(id) {
    return `<i class="fa fa-edit fa-1x text-primary" onclick="editPost(${id})"></i>
    <i class="fa fa-trash fa-1x text-danger"  onclick="DeleteConfirmation(${id})"></i>
    <i class="fa fa-eye fa-1x text-success"  onclick="ShowPostData(${id})"></i>`
}

function editPost(id) {
    var postData = getPostData(id);
    fillDataInEditForm(postData);
    $('#editPostModal').modal('show');
}

function fillDataInEditForm(post) {
    $('#edit-id').val(post.id);
    $('#edit-userId').val(post.userId);
    $('#edit-title').val(post.title);
    $('#edit-body').val(post.body);
}

function getPostData(id) {
    return postArray.find(x => x.id == id);
}
function getTruncatedRow(rowData) {
    return truncateString(rowData, 45);
}

function truncateString(str, num) {
    if (str.length > num) {
        return str.slice(0, num) + "...";
    } else {
        return str;
    }
}

function savePost(event) {
    var newData = getEditedPostData();
    var currentData = postArray.find(x => x.id == newData.id);
    currentData.title = newData.title;
    currentData.userId = newData.userId;
    currentData.body = newData.body;
    updateLocalStorage();
}

function getEditedPostData() {
    return {
        id: $('#edit-id').val(),
        userId: $('#edit-userId').val(),
        title: $('#edit-title').val(),
        body: $('#edit-body').val()
    };
}



function fillData(post) {
    $('#view-id').text(post.id);
    $('#view-userId').text(post.userId);
    $('#view-title').text(post.title);
    $('#view-body').text(post.body);
}

function ShowPostData(id) {
    var postData = getPostData(id);
    fillData(postData);
    $('#viewPostModal').modal('show');
}

function DeleteConfirmation(id){
    localStorage.setItem("del-id",id)
    $('#deletePostModal').modal('show');    
}


function DeletePostData(){
    var deleteItemId = parseInt(localStorage.getItem("del-id"));
    postArray = postArray.filter(x => x.id != deleteItemId);
    $('#deletePostModal').modal('hide');
    updateLocalStorage();
    table.destroy();
    loadTableData();
}
