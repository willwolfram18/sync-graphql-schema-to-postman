using my_dotnet.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddGraphQLServer()
    .AddQueryType<Query>()
    .AddType<Person>();

var app = builder.Build();

app.MapGraphQL();
app.MapBananaCakePop();

app.Run();
