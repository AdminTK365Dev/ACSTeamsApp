using Microsoft.AspNetCore.Mvc;
using WebApi;
using WebApi.Model;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<IUserRepository, InMemoryUserRepository>();
builder.Services.AddSingleton(typeof(AcsServiceClient));

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddMemoryCache();
builder.Services.AddCors(options => options.AddDefaultPolicy(builder =>
{
    builder.AllowAnyOrigin();
}));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors();
}
else
{
    // same for Azure
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors();
}

app.UseHttpsRedirection();

app.MapGet("/api/customer", ([FromQuery(Name = "acsId")] string? acsId, IUserRepository userRepository) => {
    System.Diagnostics.Debug.WriteLine("getting customer: " + acsId);
    if (string.IsNullOrEmpty(acsId))
    {
        return Results.Json(userRepository.GetAllCustomers());
    }
    else
    {
        return Results.Json(userRepository.GetCustomer(acsId));
    }
}).Produces(StatusCodes.Status200OK);

app.MapGet("/api/employee", ([FromQuery(Name = "aadId")] string? aadId, [FromQuery(Name = "acsId")] string? acsId, IUserRepository userRepository) => {
    System.Diagnostics.Debug.WriteLine("getting employee: " + aadId);
    if (string.IsNullOrEmpty(acsId) && string.IsNullOrEmpty(aadId))
    {
        return Results.Json(userRepository.GetAllEmployees());
    }
    else
    {
        return Results.Json(userRepository.GetEmployee(aadId, acsId));
    }
}).Produces(StatusCodes.Status200OK);

app.MapGet("/api/accessToken", ([FromQuery(Name = "acsId")] string acsId, AcsServiceClient acsClient) => {
    return Results.Text(acsClient.GetAccessToken(acsId));
}).Produces(StatusCodes.Status200OK);

app.MapGet("/api/customerChatThread", ([FromQuery(Name = "customerAcsId")] string customerAcsId, [FromQuery(Name = "employeeAadId")] string? employeeAadId, AcsServiceClient acsClient, IUserRepository userRepository) => {
    System.Diagnostics.Debug.WriteLine("getting thread for customer:" + customerAcsId + " employee:" + employeeAadId);
    Customer customer = userRepository.GetCustomer(customerAcsId);
    if (customer == null)
    { 
        return Results.Text(string.Empty);
    }

    if (string.IsNullOrEmpty(customer.chatThreadId))
    { 
        customer.chatThreadId = acsClient.GetOrCreateCustomerChatThreadId(customer);
    }

    if (!string.IsNullOrEmpty(employeeAadId))
    {
        Employee employee = userRepository.GetEmployee(employeeAadId, null);
        if (employee != null)
        {
            acsClient.EnsureEmployeeOnCustomerThread(customer, employee);
        }
    }

    return Results.Text(customer.chatThreadId);

}).Produces(StatusCodes.Status200OK);

app.Run();
