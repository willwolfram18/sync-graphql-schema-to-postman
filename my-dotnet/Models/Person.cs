namespace my_dotnet.Models;

public class Person
{
    [GraphQLType(typeof(NonNullType<IdType>))]
    public Guid Id { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }
}