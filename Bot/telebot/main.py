import firebase_admin
from firebase_admin import credentials, firestore
from telegram import update

import Constants as keys
from telegram.ext import *
updater = Updater(keys.API_KEY, use_context=True)

cred = credentials.Certificate("todo-6d55c-firebase-adminsdk-kexwx-ec360c7bc0.json")
firebase_admin.initialize_app(cred)
db = firestore.client()


users_ref = db.collection('users')
query = users_ref.stream()
# query = users_ref.where('Name','==','Emilio').stream()

# for i in query:
#     userInfo_ref = db.collection(i.id)
#     # ref = db.collection(temp_ref).document(inspiration)
#     usersInfo_Query = userInfo_ref.stream()
#     print(i.to_dict())
#     for j in usersInfo_Query:
#         # print(j.id)
#         # print(j.to_dict())
#         print(j.to_dict()["todos"])
#     print("----")

#     # todos_query = temp_ref
#     # print(f'{i.id} => {i.to_dict()}')

# def showAllUsers():
#     for i in query:


def showToDos(email):
    showToDos_query = users_ref.where('Email','==',email).stream()
    # showToDos_query = users_ref.where('Email','==',email).stream()
    try:
        id = list(showToDos_query)[0].id
        # print("User exist")
    except Exception as e:
        print("User doesn't exist")
    
    # print(id)
    todosArray = []
    userCollection_ref = db.collection(id)
    userCollection_query = userCollection_ref.stream()
    for i in userCollection_query:
        # print(i.to_dict()["todos"])
        todosArray.append(i.to_dict()["todos"])
    #     print(i.id)
    return todosArray

def getUser_ID(email):
    users_query = users_ref.where('Email', '==', email).stream()
    for i in users_query:
        # print(i.to_dict())
        return(i.id)

def getToDo_ID(userID,todo):
    userCollection_ref = db.collection(userID)
    queryToDos = userCollection_ref.where('todos','==',todo).stream()
    for i in queryToDos:
        # print(i.to_dict())
        if i.to_dict()["todos"] == todo:
            return(i.id)


def deleteToDos(email,todo):
    userID = getUser_ID(email)
    todoID = getToDo_ID(userID,todo)

    db.collection(userID).document(todoID).delete()


def addToDo(email,todo):
    userID = getUser_ID(email)
    data = {
        "todos" : todo
    }
    db.collection(userID).add(data)

def updateToDo(email,oldTodo,newToDo):
    userID = getUser_ID(email)
    userCollection_ref = db.collection(userID).document(getToDo_ID(userID,oldTodo))
    userCollection_ref.update({'todos': newToDo})



# Telegram
def responses(input,username):
# def responses(input):

    # user_message = str(input).lower()
    user_message = str(input)
    user_message_split = user_message.split(" ")

    # updater = Updater(keys.API_KEY, use_context=True)
    if user_message in ("todos","todo","t","show"):
        return "TODO's: \n"+"\n".join(showToDos(username))
        # return str(username)
    
    if user_message_split[0] in ("add","agregar","a"):
        addToDo(username, user_message_split[1])
        return "Agregando!"
    
    if user_message_split[0] in ("eleminar","delete","d","e"):
        deleteToDos(username,user_message_split[1])
        # TODO!: Validar eliminación
        return "Eliminando! "
    
    if user_message_split[0] in ("m","mod", "modify", "modificar"):
        # user_message_split = user_message.split(" ")
        updateToDo(username,user_message_split[1],user_message_split[2])
        return "Modificado!"
    
    return "No te entendí"

print("Bot started ...")

def start_command(update,context):
    update.message.reply_text("Type something")

def help_command(update,context):
    update.message.reply_text("Help Message")

def handle_message(update, context):
    text = str(update.message.text)
    # var = update.message.from_user
    var = update.message.chat.first_name
    response = responses(text,var)
    
    update.message.reply_text(response)

def error(update, context):
    print(f"Update {update} caused error {context.error}")

def main():
    
    dispatcherr = updater.dispatcher
    dispatcherr.add_handler(CommandHandler("start",start_command))
    dispatcherr.add_handler(CommandHandler("help",help_command))
    dispatcherr.add_handler(MessageHandler(Filters.text, handle_message))
    dispatcherr.add_error_handler(error)
    
    updater.start_polling() # Five seconds
    updater.idle()

if __name__ == "__main__":
    
    
    # print(showToDos("emilio@tec.mx"))
    # print(getUser_ID("emilio@tec.mx"))
    # print(getToDo_ID("K41ev1j8YkSO6zUKWXObtuvK2HZ2","Dormir"))

    # deleteToDos("emilio@tec.mx","Dormir")
    # addToDo("emilio@tec.mx","Dormir")
    # updateToDo("K41ev1j8YkSO6zUKWXObtuvK2HZ2","Dormir","Dormir ya")

    main()
