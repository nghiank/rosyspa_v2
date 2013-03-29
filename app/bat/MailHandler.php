<?php
  include 'smtp.php';
	$owner_email = $_POST["owner_email"];
	$headers = 'From:' . $_POST["email"];
	$subject = 'A message from your site visitor ' . $_POST["name"];
	$messageBody = "";
  $phone = "nope_phone";
  $phonespam = "";
	
	if($_POST['name']!='nope'){
		$messageBody .= '<p>Ten: ' . $_POST["name"] . '</p>' . "\n";
		$messageBody .= '<br>' . "\n";
	}
	if($_POST['email']!='nope'){
		$messageBody .= '<p>Email Address: ' . $_POST['email'] . '</p>' . "\n";
		$messageBody .= '<br>' . "\n";
	}else{
		$headers = '';
	}
	if($_POST['state']!='nope'){		
		$messageBody .= '<p>State: ' . $_POST['state'] . '</p>' . "\n";
		$messageBody .= '<br>' . "\n";
	}
	if($_POST['phone']!='nope'){		
		$messageBody .= '<p>Phone Number: ' . $_POST['phone'] . '</p>' . "\n";
		$messageBody .= '<br>' . "\n";
    $phone = $_POST['phone'];
	}	
	if($_POST['phonespam']!='nope'){		
    $phonespam = $_POST['phonespam'];
	}	
	if($_POST['fax']!='nope'){		
		$messageBody .= '<p>Fax Number: ' . $_POST['fax'] . '</p>' . "\n";
		$messageBody .= '<br>' . "\n";
	}
	if($_POST['date']!='nope'){
		$messageBody .= '<p>Ngay: ' . $_POST['date'] . '</p>' . "\n";
	}
	if($_POST['time']!='nope'){
		$messageBody .= '<p>Gio: ' . $_POST['time'] . '</p>' . "\n";
	}
	if($_POST['service']!='nope'){
		$messageBody .= '<p>Dich vu: ' . $_POST['service'] . '</p>' . "\n";
	}
	if($_POST['message']!='nope'){
		$messageBody .= '<p>Thong tin them: ' . $_POST['message'] . '</p>' . "\n";
	}
	
	if($_POST["stripHTML"] == 'true'){
		$messageBody = strip_tags($messageBody);
	}
	
  if ($phonespam == $phone && strlen($phonespam)!=0)
  { 
    try{
      if(!SendMail("lienhe@rosyspa.com", $owner_email, $subject, $messageBody, $headers)){
        throw new Exception('mail failed');
      }else{
        echo 'mail sent';
      }
    }catch(Exception $e){
      echo $e->getMessage() ."\n";
    }
  } else{
    echo "seems to spam email";
  }
?>
