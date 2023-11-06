using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Runtime.Serialization.Json;
using webapi.models;

namespace webapi.Controllers;

[ApiController]
[Route("api")]
public class APIController : ControllerBase
{
    private readonly ILogger<APIController> _logger;

    public APIController(ILogger<APIController> logger)
    {
        _logger = logger;
    }

    [HttpGet("GetQuestions")]
    public async Task<List<QuestionListModel>> GetAsync()
    {
        List<QuestionListModel> list = new List<QuestionListModel>();
        list.Add(new QuestionListModel { title = "TEST", answer_count = 10, question_id = 1, tags = new List<string>() });
        list.Add(new QuestionListModel { title = "TEST2", answer_count = 8, question_id = 2, tags = new List<string>() });
        return list;
        //// Get the data.
        //using (var client = new HttpClient(new HttpClientHandler { AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate }))
        //{
        //    client.BaseAddress = new Uri("https://api.stackexchange.com/2.3");
        //    HttpResponseMessage response = await client.GetAsync("search/advanced?order=desc&sort=creation&accepted=True&answers=2&site=stackoverflow");

        //    if (response.IsSuccessStatusCode)
        //    {
        //        var data = response.Content.ReadAsStringAsync().Result;
        //        return data;

        //    }
        //    else
        //    {
        //        return response.StatusCode.ToString();
        //    }
        //}
    }
}
