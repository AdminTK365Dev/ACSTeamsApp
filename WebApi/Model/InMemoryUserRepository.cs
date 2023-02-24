using Microsoft.AspNetCore.Localization;
using System.Text.Json;

namespace WebApi.Model
{
    public class InMemoryUserRepository : IUserRepository
    {
        private List<Customer> _customerData;
        private List<Employee> _employeeData;

        public InMemoryUserRepository(IConfiguration configuration)
        {
            string rootDirectory = Directory.GetCurrentDirectory();
            string customerFile = File.ReadAllText(rootDirectory + @"\data\customer.json");
            _customerData = JsonSerializer.Deserialize<List<Customer>>(customerFile);

            string employeeFile = File.ReadAllText(rootDirectory + @"\data\employee.json");
            _employeeData = JsonSerializer.Deserialize<List<Employee>>(employeeFile);
        }

        public Customer? GetCustomer(string acsId)
        {
            Customer c = _customerData.Where(c => c.acsId == acsId).SingleOrDefault();
            return c;
        }

        public List<Customer> GetAllCustomers()
        {
            return _customerData;
        }

        public Employee? GetEmployee(string? aadId, string? acsId)
        {
            if(!string.IsNullOrEmpty(aadId))
            {
                return _employeeData.Where(c => c.aadId == aadId).SingleOrDefault();
            }
            else if(!string.IsNullOrEmpty(acsId))
            {
                return _employeeData.Where(c => c.acsId == acsId).SingleOrDefault();
            }
            else
            {
                return null;
            }
        }

        public List<Employee> GetAllEmployees()
        {
            return _employeeData;
        }
    }
}
