class Admin{
    constructor(AdminID, FirstName, LastName, Email, PhoneNumber, Role, Password){
        this.AdminID = AdminID;
        this.FirstName = FirstName;
        this.LastName = LastName;
        this.Email = Email;
        this.PhoneNumber = PhoneNumber;
        this.Role = Role;
        this.Password = Password;
    }
}

module.exports = Admin;