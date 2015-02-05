function getXMLContent($url)
{
    var $data = [], $ttl = 0, $result = {};
    if (window.XMLHttpRequest)
    {
        xhttp=new XMLHttpRequest();
        xhttp.open("GET",$url,false);
        xhttp.send();
        response=xhttp.responseXML;
        //alert(response);
        
        var $slides = $(response).find('slide');
        var $courseName = $(response).find('course_name').text();
        $slides.each(function()
        {
            $cat = $(this).attr('category');

            var $tempObj = {};

            $tempObj.id = $(this).attr('id');
            $tempObj.animated = $(this).attr('animated');
            $tempObj.thumb_image = $(this).find('thumb_image').text();
            $tempObj.content = $(this).find('content').text();
            $tempObj.footer = $(this).find('footer').text();

            $data.push($tempObj);

        });

        $ttl = $data.length;
    }
    else
    {
        /*var $tempObj = {};

        $tempObj.id = 'p0';
        $tempObj.animated = 'no';
        $tempObj.thumb_image = '';
        $tempObj.content = 'Not available';
        $tempObj.footer = '';

        $data.push($tempObj);
        $ttl = 1;
        /*$.ajax({
            type: "GET",
            url: $url,
            async: false,
            dataType: "xml",
            success: function(response){
                var $slides = $(response).find('slide');
                $slides.each(function(){
                    $cat = $(this).attr('category');

                    var $tempObj = {};

                    $tempObj.id = $(this).attr('id');
                    $tempObj.animated = $(this).attr('animated');
                    $tempObj.thumb_image = $(this).find('thumb_image').text();
                    $tempObj.content = $(this).find('content').text();
                    $tempObj.footer = $(this).find('footer').text();

                    $data.push($tempObj);

                });

                $ttl = $data.length;

            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                alert('status ' + textStatus);
                alert('err ' + errorThrown);
            }
        });*/
    }


    $result.data = $data;
    $result.ttl = $ttl;
    $result.courseName = $courseName;
    
    return $result;
}

function makeThumbList($data)
{
    var $thumbs = '<div id="scrollable">';
    
    for(var $j = 0; $j < $data.length; $j++)
    {
        $thumbs = $thumbs + '<a href="#p' + $data[$j].id + '" class="scrolldeck"><img src="' + $data[$j].thumb_image + '" /></a>';
    }
    
    $thumbs = $thumbs + '</div>';
    
    return $thumbs;
}

function makeSlides($results)
{
    var $slideContent = '';
    var $photoClassMax = 16;
    var $data = $results.data;
    
    for(var $k = 0; $k < $data.length; $k++)
    {
        var $cls = $k % $photoClassMax + 1;
        var $animatedCls = '';
        
        if($data[$k].animated == 'yes')
            $animatedCls = ' animate-slide';
        
        $slideContent = $slideContent + '<section id="p' + $data[$k].id + '" class="photo p' 
                + $cls + '" data-stellar-background-ratio="0.6" data-stellar-vertical-offset="350">' 
                + '<div class="photo_bottom" id="p' + $data[$k].id + '_bottom"></div>'
                + '</section>';
        $slideContent = $slideContent + '<section id="s' + $data[$k].id + '" class="slide' + $animatedCls + '">' + $data[$k].content;
        
        if($k == 0)
        {
            $slideContent = $slideContent + '<div class="qc-footer"><div class="container"><div class="row">' +
            '<div class="col-sm-12 qc-next"><a href="#p' + $data[$k + 1].id + '" class="scroll">Begin</a></div></div></div></div>';
        }
        else if($k == $data.length - 1)
        {
            $slideContent = $slideContent +  '<div class="qc-footer"><div class="container"><div class="row">' +
            $results.courseName +
            '<div class="col-sm-2 qc-next"><a href="#p' + $data[0].id + '" class="scroll">Next</a></div>' + 
            $data[$k].footer + '<div class="col-sm-1 qc-page-num">' + ($k + 1) + '</div></div></div></div>';
        }
        else
        {
             $slideContent = $slideContent +  '<div class="qc-footer"><div class="container"><div class="row">' +
            '<div class="col-sm-5 qc-title">Quality Assurance/Quality Control Course Lesson 1: Safety Management System (SMS)</div>' +
            '<div class="col-sm-2 qc-next"><a href="#p' + $data[$k+1].id + '" class="scroll">Next</a></div>' + 
            $data[$k].footer + '<div class="col-sm-1 qc-page-num">' + ($k + 1) + '</div></div></div></div>';
        }
        
        $slideContent = $slideContent + '</section>';
    }
    
    $slideContent = $slideContent + '<section id="plast" class="photo p13" data-stellar-background-ratio="0.6" data-stellar-vertical-offset="250">&nbsp;</section>';
    return $slideContent;
}



