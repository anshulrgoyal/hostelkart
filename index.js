const express=require('express');
const app=express();
const ejs=require('ejs')
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const buy=require('./model.js');
app.use(express.static(__dirname+'/public'))
mongoose.connect('mongodb://argoyal:8285578793a@ds155218.mlab.com:55218/imdbapi');
app.use(bodyParser.urlencoded({ extended: false }))
app.get('/',(req,res)=>{
  res.render('list.ejs')
})
const nodemailer=require('nodemailer');
var template=ejs.compile(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Thank You</title>
  <style>
  *{
    margin: 0;
    padding: 0;
  }
  </style>
</head>
<body>
    <div style="font-size: 32px;text-align: center;color: skyblue">Thank You For Choosing <br> <span style="color: grey;font-weight: 700">Hostelkart</span></div>

    <div style="color: gray;display: flex; justify-content: space-between" >Profile <span>
      Order ID: <%=book.bookid%>
    </span></div>
    <hr style="color: grey">
    <div>
      <%const time={'1':"12-1pm","2":'3-4pm',"3":'6-7pm'}%>
      <%const cost={'1':{'p1':'3499','p2':'6199','p3':'9799'},'2':{'p1':'2099','p2':'4699','p3':'5999'}}%>
      <div style="display: flex;flex-direction: column;padding: 20px;">
        <div><span>Name:</span><span><%=book.name%></span></div>
        <div><span>Address:</span><span><%=book.hostel %></span></div>
        <div><span>Contact Number:</span><span><%=book.number%></span></div>
        <div><span>Delivery Date:</span><span><%=book.date%></span></div>
        <div><span>Delivery Time:</span><span><%=time[book.time]%></span></div>
        <div><span>Comments:</span><span><%=book.comment%></span></div>
      </div>
    </div>
    <div style="color: gray">Order Detials</div>
    <hr style="color:grey">
     <div style="display: flex;padding: 20px;justify-content: space-between;">
      <span style="font-size: 24px">Order Detials</span> <span>(Including GST) <%=cost[book.colg][book.type]%></span>
     </div>
</body>
</html>
`)
app.use(express.static(__dirname+'/public'))
app.post('/',(req,res)=>{
const pop=new buy(req.body);
pop.bookid=Date.now()
pop.save();

var transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, //ssl
    auth: {
            user:'info@venturesky.in',
            pass:'bhosdika'
    }
});
transporter.sendMail({
    from: 'info@venturesky.in',
    bcc: 'rishabhrawat35@gmail.com',
    subject: 'HosteKart Order Details',
    html: template({book:pop})
    
});
res.render('thanku.ejs',{book:pop})
});
app.get('/admin',function(req,res){
  buy.find({}).then((data)=>{
    res.render('show.ejs',{data})
  })
})
app.get('/payment/pay/:bookid',function(req,res){
  buy.find({bookid:Number(req.params.bookid)}).then((data)=>{
    res.send(template({book:data[0]}))
    console.log(data)
    var transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true, //ssl
      auth: {
              user:'info@venturesky.in',
              pass:'bhosdika'
      }
  });
  transporter.sendMail({
      from: 'info@venturesky.in',
      bcc: data[0].email,
      subject: 'HosteKart Order Details',
      html: template({book:data[0]})
      
  });
  })
 
})
app.get('/booking/:id',function(req,res){
  buy.findById(req.params.id).then((data)=>{
    res.render('details.ejs',{data})
  })
})
app.get('/payment/:type',function(req,res){
  res.render('pay.ejs',{type:req.params.type})
})


//app.listen(process.env.PORT);
app.listen(process.env.PORT||3000)
