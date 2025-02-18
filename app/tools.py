from langchain_core.runnables import Runnable

user_data = {
    "employee_code": "12345",
    "first_name": "Akash",
    "last_name": "Ramdham",
    "doj": "03-Jul-2023",
    "program": "IT",
    "designation": "AI Developer",
    "personal_email": "akash.r@gmail.com",
    "official_email": "akash.r@xyztechnology.com",
    "bank_name": "SBI",
    "account_no": "923010037",
}

msg_contact_HR = "<b>Please contact HR on</b>: </br> <i class='fa fa-envelope' style='font-size:15px;color:grey'></i>&nbsp; <a href='mailto:Emp.Relations@epicentertechnology.com' style='color: blue; text-decoration: underline;'>Emp.Relations@epicentertechnology.com</a>"


class DateTool:

    def __init__(self, date_format: str = "%Y-%m-%d"):
        self.date_format = date_format

    def run(self, query: str) -> str:
        import datetime
        today = datetime.date.today()
        return f"\n {today} \n"


class GetUserDetailsTool:

    def __init__(self, user_data) -> None:
        self.user_data = user_data

    def run(self, query: str) -> str:
        query = query.replace('\\', '')

        for key in user_data.keys():
            if key in query.lower():
                return f"\n {key.capitalize()}: {user_data[key]} \n"

        return "\n No data \n"


class UserSalaryNotReceivedTool:

    def __init__(self, user_data) -> None:
        self.user_data = user_data

    def run(self, query: str) -> Runnable:
        # Prepare the message to ask for confirmation
        message = (
            f"Please verify your existing bank account details:\n"
            f"Bank: {self.user_data['bank_name']}\n"
            f"Account No: {self.user_data['account_no']}\n"
            "Is this information correct? (Y/Yes to confirm, anything else will be treated as 'No')"
        )

        # Simulate user response for the purpose of this code
        # In a real chatbot, this would be managed differently
        response = input(message)

        # Handle the response
        if response.lower() in ("yes", "y"):
            return msg_contact_HR
        else:
            return UpdateBankDetailsTool().run(query)


class UpdateBankDetailsTool:

    def __init__(self) -> None:
        pass

    def run(self, query: str = None) -> str:
        # Provide instructions for updating bank details
        text = """
        <b>Please follow the below steps to link/update your salary account with XYZ.</b><br><br>
        <b>Step 1:</b> Share the details with the HR Team at Emp.Relations@xyztechnology.com 
        with Subject Line – <b>Salary Account Updation – (Employee code)</b> and provide the 
        below details in the email body along with the attachment.<br><br>
        <b>Step 2:</b> Attach the following documents as per the below options:<br>
        1. Soft copy of Cancelled Cheque.<br>
        2. Soft copy of Passbook where your Name, Account number, and IFSC are visible.<br>
        3. Snapshot of Mobile Banking App where your Name, Account number, and IFSC is visible.<br><br>
        <b>***Submission of details post 20th of the month will be considered in the subsequent payroll cycle.</b>
        """

        return text


class ConversationState:
    def __init__(self):
        self.contact_hr_teg = None
        self.issue_resolved = None

    def update_state(self, key, value):
        setattr(self, key, value)

    def get_state(self):
        return {
            "contact_hr_teg": self.contact_hr_teg,
            "issue_resolved": self.issue_resolved,
        }


class HandleSalaryIssueTool:

    def __init__(self, conversation_state, user_data) -> None:
        self.conversation_state = conversation_state
        self.user_data = user_data

    def run(self, query: str) -> str:
        # Check the current state of the conversation
        state = self.conversation_state.get_state()

        # Initial question if no prior state exists
        if state['contact_hr_teg'] is None:
            message = (
                "Have you contacted the HR TEG for a solution? (Yes/No)"
            )
            # Simulate user response for the purpose of this code
            response = input(message)
            print("response : ", response)

            # Update state based on response
            if response.lower() in ("yes", "y"):
                self.conversation_state.update_state("contact_hr_teg", True)
                message = "Is the issue resolved? (Yes/No)"
                response = input(message)

                # Update state based on response
                if response.lower() in ("yes", "y"):
                    return "Great! I'm glad your issue is resolved."
                else:
                    self.send_email_to_hr(self.user_data['official_email'])
                    return "I've sent an email to HR regarding your issue. You'll receive a reference mail soon."

            else:
                self.conversation_state.update_state("contact_hr_teg", False)
                return (
                    "Please contact HR TEG for a solution. "
                    "If the issue is resolved after contacting them, let me know."
                )

        # Fallback if no action is taken
        return "I'm not able to handle this issue right now, please contact HR."

    def send_email_to_hr(self, user_email):
        print(f"Email sent to HR at {user_email}.")
        # Implement email sending functionality here
        pass


class PayslipCorrectionTool:
    def __init__(self, user_data) -> None:
        self.user_data = user_data

    def run(self, query: str) -> str:
        print('query : ', query)
        if 'designation' in query.lower():
            print('Designation Change Request')
            designation = user_data['designation']
            message = (f"Following is your current designation<br><b>Designation: {designation}"
                       "</b><br><br>Please verify the above details."
                       "Is this information correct? (Y/Yes to confirm, anything else will be treated as 'No')"
                       )
            response = input(message)
            if response.lower() in ('yes', 'y'):
                message = "Mail is sent to the team. They will reach you in two working days."
                return message
            else:
                message = "Mail is sent to the team. They will reach you in two working days."
                return message

        elif 'department' in query.lower():
            print('Department Change Request')
            department = user_data['department']
            message = (f"Following is your current designation<br><b>Department: {department}"
                       "</b><br><br>Please verify the above details."
                       "Is this information correct? (Y/Yes to confirm, anything else will be treated as 'No')"
                       )
            response = input(message)
            if response.lower() in ('yes', 'y'):
                message = "Mail is sent to the team. They will reach you in two working days."
                return message
            else:
                message = "Mail is sent to the team. They will reach you in two working days."
                return message
        else:
            # print("I'm not able to handle this issue right now, please contact HR.")
            return "I'm not able to handle this issue right now, please contact HR."
