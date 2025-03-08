import conf from "../conf/conf"
import {Client, Account, ID} from "appwrite"

export class AuthService{
    client = new Client();
    account;
    token;
    userId;

    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId)
        this.account = new Account(this.client); 
    }

    async createAccount({email,password,name}){
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if(userAccount){
                return this.login({email,password});
            }else{
                return userAccount;
            }
        } catch (error) {
            throw error;
        }
    }

    async SendOtp({email}){
         try {
            const sessionToken = await this.account.createEmailToken(
                this.userId = ID.unique(),  
                email,
            );
            const userId = sessionToken.userId;
            this.token = userId;
            return userId;
         } catch (error) {
            throw error;
         }
    }

    async verifyOtp(otp){
        try {
            const session = await this.account.createSession(
                this.userId, // otp
                this.token,// userId, // token generated by function
            );
            if(session){
                return session;
            }
        } catch (error) {
            throw error;
        }
    }

    async login({email, password}){
        try {
            return await this.account.createEmailPasswordSession(email,password);
        } catch (error) {
            throw error
        }
    }

    async getCurrentUser(){
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite serive :: getCurrentUser :: error", error);
            throw error;
        }
    }

    async logout(){
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite serive :: logout :: error", error);
            throw error;
        }
    }
    

}


const authService = new AuthService();

export default authService
