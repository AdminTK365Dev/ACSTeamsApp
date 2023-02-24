using Azure;
using Azure.Core;
using Azure.Communication;
using Azure.Communication.Chat;
using Azure.Communication.Identity;
using WebApi.Model;

namespace WebApi
{
    public class AcsServiceClient
    {
        private Uri endpointUri = new Uri("<your ACS resource endpoint URI>");
        private string connectionString = "<your ACS resource connection string>";

        private CommunicationIdentityClient identityClient;

        public AcsServiceClient()
        {
            identityClient = new CommunicationIdentityClient(connectionString);
        }

        public string GetAccessToken(string acsId)
        {
            System.Diagnostics.Debug.WriteLine("Getting access token for: " + acsId);
            string token = string.Empty;
            try
            {
                List<CommunicationTokenScope> scopes = new List<CommunicationTokenScope>();
                scopes.Add(CommunicationTokenScope.Chat);
                scopes.Add(CommunicationTokenScope.VoIP);
                AccessToken accessToken = identityClient.GetToken(new CommunicationUserIdentifier(acsId), scopes);
                token = accessToken.Token;
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine("Exception getting access token for: " + acsId);
                //System.Diagnostics.Debug.WriteLine(ex);
            }

            return token;
        }

        /// <summary>
        /// Each Customer is a member of exactly one thread, with one or more Employees.
        /// This is specific to this solution where each customer only participates in a single thread
        /// </summary>
        public string GetOrCreateCustomerChatThreadId(Customer customer)
        {
            string token = GetAccessToken(customer.acsId);
            ChatClient chatClient = new ChatClient(endpointUri, new CommunicationTokenCredential(token));

            Pageable<ChatThreadItem> chatThreads = chatClient.GetChatThreads();
            ChatThreadItem? cti = chatThreads.FirstOrDefault();
            if (cti != null)
            {
                // should probably make sure there are not more than one thread
                return cti.Id;
            }

            // chat thread was not found so create it
            List<ChatParticipant> chatParticipants = new List<ChatParticipant>();
            ChatParticipant participant = new ChatParticipant(new CommunicationUserIdentifier(customer.acsId));
            participant.DisplayName = customer.displayName;
            chatParticipants.Add(participant);
            CreateChatThreadResult createChatThreadResult = chatClient.CreateChatThread("Chat thread for Customer " + customer.acsId, chatParticipants);
            return createChatThreadResult.ChatThread.Id;
        }

        public void EnsureEmployeeOnCustomerThread(Customer customer, Employee employee)
        {
            string token = GetAccessToken(customer.acsId);
            ChatThreadClient chatThreadClient = new ChatThreadClient(customer.chatThreadId, endpointUri, new CommunicationTokenCredential(token));
            ChatParticipant participant = new ChatParticipant(new CommunicationUserIdentifier(employee.acsId));
            participant.DisplayName = employee.displayName;
            chatThreadClient.AddParticipant(participant);
        }
    }
}
