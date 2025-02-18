from django.shortcuts import render
from .llm_utils import agent
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
import time
import json
import pyodbc

# Create your views here.


def home(request):
    return render(request, "app/chatroom.html")


def get_chat_response(request):
    data = json.loads(request.body)
    message = data['message']
    # if temp_tool[-1] == "UserSalaryNotReceivedTool":

    response = agent.invoke({'input': message})
    print('response', response)
    output = [{'text': response["output"]}]
    print("output : ", output)
    # return HttpResponse(output)
    return JsonResponse(output, safe=False)


def user_login(request):
    userid = request.POST.get('ecn')
    password = request.POST.get('password')
    # Replaced SQL Server with ODBC Driver 17 for SQL Server - AR - 11/07/24
    connection = pyodbc.connect('Driver={ODBC Driver 17 for SQL Server};'
                                'Server=172.30.33.132;'
                                'Database=HRMS_Analytics_2.0_Live;'
                                'UID=sa;'
                                'PWD=Apr@2024;')
    cursor = connection.cursor()
    if userid and password:
        sql = "SELECT Username, Password FROM [LoginMaster] WHERE  Username='" + \
            userid + "' AND Password='" + password + "'"
        myresult = cursor.execute(sql).fetchone()

        if (userid).lower() == (myresult[0]).lower() and password == myresult[1]:
            print("success': True'")
            return JsonResponse({'success': True})
        else:
            print("success': False'")
            return JsonResponse({'success': False})


def user_DOJ(request):
    userid = request.GET.get('ecn')
    userid = userid[2:]
    # Replaced SQL Server with ODBC Driver 17 for SQL Server - AR - 11/07/24
    connection = pyodbc.connect(
        'Driver={ODBC Driver 17 for SQL Server};' 'Server=172.30.33.132;' 'Database=HRMS_Analytics_2.0_Live;' 'UID=sa;' 'PWD=Apr@2024;')
    cursor = connection.cursor()
    sql = "SELECT doj FROM [HRMS_Analytics_2.0_Live].[dbo].[vw_employee_data] WHERE  employee_code='" + userid + "'"
    myresult = cursor.execute(sql)
    for i in myresult:
        result = i[0]
    return JsonResponse({'success': True, 'data': result})


def submit_Rating(request):
    rating = request.POST.get('rating')
    senderID = request.POST.get('senderID')
    print(senderID, '*********************senderID********************')
    unix_time = time.time()
    # Replaced SQL Server with ODBC Driver 17 for SQL Server - AR - 11/07/24
    connection = pyodbc.connect(
        'Driver={ODBC Driver 17 for SQL Server};' 'Server=172.30.33.132;' 'Database=HRMS_Analytics_2.0_Live;' 'UID=sa;' 'PWD=Apr@2024;')
    cursor = connection.cursor()
    # sql ="INSERT INTO [HRMS_Analytics_2.0_Live].[dbo].[events] (sender_id, type_name, timestamp,data) VALUES ('"+senderID+"','user', "+str(unix_time)+",'{"+ '"' + "event"+ '"' + ": "+ '"' + "user"+ '"' + ", "+ '"' + "timestamp"+ '"' + ":" + str(unix_time) + ", "+ '"' + "text"+ '"' + ": " + str(rating) + "}');"
    last_row_sql = "Select TOP 1 [id],[sender_id],[type_name],[timestamp],[intent_name],[action_name],[data] FROM [HRMS_Analytics_2.0_Live].[dbo].[events] order by id desc"
    result = cursor.execute(last_row_sql)
    data = {}
    for i in result:
        data = i[-1]
        data = json.loads(data)
        # print(type(data))
    data = {k: data[k] for k in list(data)[:3]}
    data['event'] = "user"
    data['timestamp'] = unix_time
    data['text'] = f"Rating - {rating}"
    # print("data :", data)
    # Convert the dictionary to a JSON string and escape single quotes

    # Adding additional data
    additional_data = {
        "parse_data": {
            "intent": {"name": "rating", "confidence": 1.0},
            "entities": [],
            "message_id": "4d2f7ab342d94c7cb30a043714990ab2",
            "metadata": {},
            "intent_ranking": [{"name": "rating", "confidence": 1.0}]
        },
        "input_channel": "rest",
        "message_id": "4d2f7ab342d94c7cb30a043714990ab2"
    }

    # Update data_dict with additional_data
    data.update(additional_data)

    # Convert the dictionary to a JSON string and escape single quotes
    data_json = json.dumps(data).replace("'", "''")

    sql = f"""
    INSERT INTO [HRMS_Analytics_2.0_Live].[dbo].[events]
        (sender_id, type_name, timestamp, data) 
    VALUES 
        (
            '{senderID}', 
            'user', 
            {unix_time}, 
            '{data_json}'
        );
    """
    # print(sql, '**********************Rating SQL**********************************')
    cursor.execute(sql)
    cursor.commit()

    return JsonResponse({'success': True})
