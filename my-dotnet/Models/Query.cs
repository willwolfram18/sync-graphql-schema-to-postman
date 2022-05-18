using System.Collections.Generic;

namespace my_dotnet.Models;

public class Query
{
    [GraphQLName("apiVersion")]
    public string GetVersion() => throw new NotImplementedException();

    [GraphQLName("people")]
    public IEnumerable<Person> GetPeople() => throw new NotImplementedException();

    [GraphQLName("devices")]
    public IEnumerable<Device> GetDevices() => throw new NotImplementedException();
}