namespace Server
{
    public interface IUserRepository
    {
        UserAccount RegisterAccount(UserAccount userAccount);
        UserAccount GetAccount(string name);
    }
    
    public class UserAccount
    {
        public int Id;
        public string Username { get; set; }
        public string Hash { get; set; }
    }
}
