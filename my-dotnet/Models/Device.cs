namespace my_dotnet.Models;

public class Device
{
    [GraphQLType(typeof(NonNullType<IdType>))]
    public string SerialId { get; set; }

    public string? DeviceType { get; set; }
}