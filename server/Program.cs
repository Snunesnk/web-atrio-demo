using Microsoft.EntityFrameworkCore;
using Server.Models;

var AllowFront = "allowFront";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: AllowFront,
                      policy =>
                      {
                          policy.WithOrigins(Environment.GetEnvironmentVariable("FRONT_URL") ?? "http://localhost:3042")
                          .AllowAnyHeader().AllowAnyMethod();
                      });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<DatabaseContext>(options =>
        options.UseNpgsql(GetConnectionString()));


var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var dbContext = services.GetRequiredService<DatabaseContext>();
    try
    {
        dbContext.Database.EnsureCreated();
    }
    catch (Exception ex)
    {
        Console.Error.WriteLine(ex.Message);
    }
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseCors(AllowFront);

app.UseAuthorization();

app.MapControllers();

app.Run();

string GetConnectionString()
{
    var DbHost = Environment.GetEnvironmentVariable("DATABASE_URL");
    var DbUser = Environment.GetEnvironmentVariable("POSTGRES_USER");
    var DbPassword = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD");
    var DbName = Environment.GetEnvironmentVariable("POSTGRES_DB");
    var DbPort = Environment.GetEnvironmentVariable("POSTGRES_PORT");

    var connectionString = "";
    if (!string.IsNullOrEmpty(DbHost) && !string.IsNullOrEmpty(DbUser) && !string.IsNullOrEmpty(DbPassword) && !string.IsNullOrEmpty(DbName) && !string.IsNullOrEmpty(DbPort))
    {
        connectionString = $"Host={DbHost};Port={DbPort};Username={DbUser};Password={DbPassword};Database={DbName}";
    }
    else
    {
        Console.Error.WriteLine("Missing environment variables for database connection");
    }

    return connectionString;
}