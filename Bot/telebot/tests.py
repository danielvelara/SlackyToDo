import unittest
from main import getUser_ID, showToDos, getToDo_ID,  deleteToDos, addToDo

class IDTestCases(unittest.TestCase):
    def setUp(self):
        self.email = "emilio@tec.mx"

    def test_A_GetUserID(self):
        assert getUser_ID(self.email) != None, "K41ev1j8YkSO6zUKWXObtuvK2HZ2"
        
    def test_B_ShowToDos(self):
        assert showToDos(self.email) != [], "User shouldn't have empy list of todo's"

    def test_C_AddToDo(self):
        old_todo_list = showToDos(self.email)
        addToDo(self.email, "GENERIC TODO")
        assert showToDos(self.email) != old_todo_list, "Element was not added"

    def test_D_GetToDoID(self):
        user_id = getUser_ID(self.email)
        todo_id = getToDo_ID(user_id, "GENERIC TODO") 
        assert todo_id != None, "Todo doesn't have an ID"

    def  test_E_DeleteToDos(self):
        expected_todo_list = showToDos(self.email)
        expected_todo_list.remove("GENERIC TODO")
        deleteToDos(self.email, "GENERIC TODO")
        assert showToDos(self.email) == expected_todo_list, "Element was not deleted"


if __name__ == '__main__':
    unittest.main()