// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Add User button click
    $('#btnAddUser').on('click', addUser);

    // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

    $('#btnEditUser').on('click', editUser);
});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {

        // Stick our user data array into a userlist variable in the global object
        userListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);

    //Display user to edit
    $('#editUserToEdit').text(thisUserObject.username);

    //Populate data
    $('#editUserId').val(thisUserObject._id);
    $('#editUserUserName').val(thisUserObject.username);
    $('#editUserEmail').val(thisUserObject.email);
    $('#editUserFullName').val(thisUserObject.fullname);
    $('#editUserAge').val(thisUserObject.age);
    $('#editUserGender').val(thisUserObject.gender);
    $('#editUserLocation').val(thisUserObject.location);
    
}

function addUser(event) {
    event.preventDefault();

    //Basic client-side form validation / counts # of errors.
    var errorCount = 0;
    $('#addUser input').each(function(index,val) {
        if ($(this).val() === '' ) {
            errorCount++;
        }
    });

    //Makes sure errorCount is zero
    if (errorCount === 0) {

        //Compile user info into one object
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        }

        // Use AJAX to post the object to the adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function(response) {
            
            //If blank, successful
            if (response.msg === '') {
                
                //Clear form
                $('#addUser fieldset input').val('');
                
                //Update table
                populateTable();

            } else {

                //Show error if something went wrong
                alert('Error: ' + response.msg);

            }
        });

    // If form not valid (preprocessed)
    } else {
        //Error out
        alert('Please fill in all fields');
        return false;
    }
};

//Delete user
function deleteUser(event) {
    
    event.preventDefault();

        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

}

//Edit user
function editUser(event) {

    event.preventDefault();

    //Basic client-side form validation / counts # of errors.
    var errorCount = 0;
    $('#editUser input').each(function(index,val) {
        if ($(this).val() === '' ) {
            errorCount++;
        }
    });

    //Makes sure errorCount is zero
    if (errorCount === 0) {

        //Compile user info into one object
        var user = {
            'username': $('#editUser fieldset input#editUserUserName').val(),
            'email': $('#editUser fieldset input#editUserEmail').val(),
            'fullname': $('#editUser fieldset input#editUserFullName').val(),
            'age': $('#editUser fieldset input#editUserAge').val(),
            'location': $('#editUser fieldset input#editUserLocation').val(),
            'gender': $('#editUser fieldset input#editUserGender').val(),
        }

        // Use AJAX to post the object to the adduser service
        $.ajax({
            type: 'PUT',
            data: user,
            url: '/users/edituser/' + $('#editUser fieldset input#editUserId').val(),
            dataType: 'JSON'
        }).done(function(response) {
            
            //If blank, successful
            if (response.msg === '') {
                
                //Clear form
                $('#editUser fieldset input').val('');
                $('#editUserToEdit').text('');
                //Update table
                populateTable();

            } else {

                //Show error if something went wrong
                alert('Error: ' + response.msg);

            }
        });

    // If form not valid (preprocessed)
    } else {
        //Error out
        alert('Please fill in all fields');
        return false;
    }
};

