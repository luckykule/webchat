<?php 

session_start();

$DATA_RAW = file_get_contents("php://input");
$DATA_OBJ = json_decode($DATA_RAW);

$info = (object)[];

//check if logged in
if(!isset($_SESSION['userid']))
{

	if(isset($DATA_OBJ->data_type) && $DATA_OBJ->data_type != "login" && $DATA_OBJ->data_type != "signup")
	{
		
		$info->logged_in = false;
		echo json_encode($info);
		die;	
	}
	
}

require_once("classes/autoload.php");
$DB = new Database();

$Error = "";

//proccess the data
if(isset($DATA_OBJ->data_type) && $DATA_OBJ->data_type == "signup")
{

	//signup
	include("includes/signup.php");

}elseif(isset($DATA_OBJ->data_type) && $DATA_OBJ->data_type == "login")
{
	//login
	include("includes/login.php");

}elseif(isset($DATA_OBJ->data_type) && $DATA_OBJ->data_type == "logout")
{
	include("includes/logout.php");
}elseif(isset($DATA_OBJ->data_type) && $DATA_OBJ->data_type == "user_info")
{

	//user info
	include("includes/user_info.php");
}elseif(isset($DATA_OBJ->data_type) && $DATA_OBJ->data_type == "contacts")
{
	//user info
	include("includes/contacts.php");
}elseif(isset($DATA_OBJ->data_type) && ($DATA_OBJ->data_type == "chats" || $DATA_OBJ->data_type == "chats_refresh"))
{
	//user info
	include("includes/chats.php");
}elseif(isset($DATA_OBJ->data_type) && $DATA_OBJ->data_type == "settings")
{
	//user info
	include("includes/settings.php");
}elseif(isset($DATA_OBJ->data_type) && $DATA_OBJ->data_type == "save_settings")
{
	//user info
	include("includes/save_settings.php");
}elseif(isset($DATA_OBJ->data_type) && $DATA_OBJ->data_type == "send_message")
{
	 //send message
	include("includes/send_message.php");
}elseif(isset($DATA_OBJ->data_type) && $DATA_OBJ->data_type == "delete_message")
{
	 //send message
	include("includes/delete_message.php");
}elseif(isset($DATA_OBJ->data_type) && $DATA_OBJ->data_type == "delete_thread")
{
	 //send message
	include("includes/delete_thread.php");
}


function message_left($data,$row)
{
	$image = ($row->gender == "Male") ? "ui/images/user_male.jpg" : "ui/images/user_female.jpg";
	if(file_exists($row->image)){
		$image = $row->image;
	}
	
	$a = "
	<div id='message_left'>
	<div></div>
		<img  id='prof_img' src='$image'>
		<b style='float:left'>$row->username</b><br><br>
		$data->message<br><br>";

		if($data->files != "" && file_exists($data->files)){
			$a .= "<img src='$data->files' style='width:100%;cursor:pointer;' onclick='image_show(event)' /> <br>";
		}
		$a .= "<span style='font-size:11px;color:white;'>".date("M jS  H:i a",strtotime($data->date))."<span>
	<img id='trash' src='ui/icons/trash.png' onclick='delete_message(event)' msgid='$data->id' />
	</div> ";

	return $a;
}

function message_right($data,$row)
{
	$image = ($row->gender == "Male") ? "ui/images/user_male.jpg" : "ui/images/user_female.jpg";
	if(file_exists($row->image)){
		$image = $row->image;
	}
	
	$a = "
	<div id='message_right'>

	<div>";
	
	if($data->seen){
		$a .="<img src='ui/images/tick.png' style=''/>";
	}elseif($data->received){
		$a .="<img src='ui/images/tick_grey.png' style=''/>";
	}

	$a .= "</div>

		<img id='prof_img' src='$image' style='float:right'>
		<b style='float:right'>$row->username</b><br><br>

		$data->message<br><br>";

		if($data->files != "" && file_exists($data->files)){
			$a .= "<img src='$data->files' style='width:100%;cursor:pointer;' onclick='image_show(event)' /> <br>";
		}
		$a .= "<span style='font-size:11px;color:#888;'>".date("M jS  H:i a",strtotime($data->date))."<span>

		<img id='trash' src='ui/icons/trash.png' onclick='delete_message(event)' msgid='$data->id' />
	</div>";

	return $a;
}


function message_controls()
{
	
	return "
	</div  >
		<div style='background:white'>
			<span onclick='delete_thread(event)' style='border:solid thin #ccc;color:purple;cursor:pointer;'>
				清空聊天页面
				clear chat
			</span>

			<div style='display:flex;width:100%;height:35px;'>

				<label for='message_file'><img src='ui/icons/send_picture.png' 
					style='opacity:0.8;width:30px;margin-bottom:5px;cursor:pointer;border:solid thin #ccc' ></label>
				<input type='file' id='message_file' name='file' style='display:none' onchange='send_image(this.files)' />

					<a id='video_call' onclick='video_calling(event)' >
		       		<img src='ui/icons/video_call.png'  	style='opacity:0.8;width:30px;margin-bottom:5px;cursor:pointer;border:solid thin #ccc;' >
		       		</a>
						       

				<input id='message_text' onkeyup='enter_pressed(event)' style='flex:6;border:solid thin #ccc;font-size:14px;padding:4px;' type='text' placeHolder='请输入你的内容(please input content)：'/>



				
				<input id='send_information' style='flex:1;cursor:pointer;' type='button' value='send' onclick='send_message(event)'/>
				</div>

		</div>
	</div>";
}

// <a id='video_call' onclick='video_calling(event)' href=''>
// 		       		<img src='ui/icons/video_call.png'  	style='opacity:0.8;width:30px;margin-bottom:5px;cursor:pointer;border:solid thin #ccc;' >
// 		       		</a>
				