namespace WebApi.Model
{
    public interface IUserRepository
    {
        public Customer? GetCustomer(string acsId);

        public List<Customer> GetAllCustomers();

        public Employee? GetEmployee(string? aadId, string? acsId);

        public List<Employee> GetAllEmployees();
    }
}
