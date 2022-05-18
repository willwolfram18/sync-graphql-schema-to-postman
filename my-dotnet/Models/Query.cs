using System.Collections.Generic;

namespace my_dotnet.Models;

public class Query
{
    [GraphQLName("people")]
    public IEnumerable<Person> GetPeople() => throw new NotImplementedException();
}