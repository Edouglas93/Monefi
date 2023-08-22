using Sabio.Models.Domain;
using Sabio.Models.Domain.BusinessProfiles;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.LoanApplications
{
    public class LoanApplicationBorrowerBusiness
    {
        public int Id { get; set; }
        public LookUp LoanType { get; set; }
        public int LoanAmount { get; set; }
        public int LoanTerm { get; set; }
        public decimal PreferredInterestRate { get; set; }
        public int CreditScore { get; set; }
        public LookUp StatusType { get; set; }
        public bool IsBusiness { get; set; }
        public BusinessProfile BusinessProfile { get; set; }
        public List<Borrower> Borrower { get; set; }
        public List<LoanFile> LoanFiles { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public BaseUser CreatedBy { get; set; }
        public BaseUser ModifiedBy { get; set; }
        public int Total { get; set; }

    }
}
