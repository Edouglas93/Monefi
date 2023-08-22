import React from "react";

import { useNavigate } from "react-router-dom";
import { Image, Button } from "react-bootstrap";
import { CheckCircle, XCircle } from "react-feather";

import PropTypes from "prop-types";
import debug from "sabio-debug";

function LoanAppCardTemplate(props) {
  const _logger = debug.extend("LoanAppCardTemplate");
  _logger("Props:", props);

  const aApp = props.app;

  _logger({ aApp });

  const navigate = useNavigate();

  const onViewMore = (e) => {
    e.preventDefault();
    if (aApp.borrower && aApp.borrower.length > 0) {
      const borrowerId = aApp.borrower[0].id;
      _logger("Borrower ID:", borrowerId);
      navigate(`/borrowers/details/${borrowerId}`, {
        state: { type: `Borrower_View`, payload: aApp.borrower[0] },
      });
    } else {
      _logger("No borrowers found.");
    }

    if (aApp.businessProfile) {
      const businessId = aApp.businessProfile.id;
      _logger("Business ID:", businessId);
      navigate(`/business/${businessId}`, {
        state: { type: `Business_View`, payload: aApp.businessProfile },
      });
    } else {
      _logger("No business profile found.");
    }
  };

  return (
    <React.Fragment>
      <tr>
        <td>
          <div>
            <Image
              src={aApp.createdBy?.avatarUrl}
              alt='user image'
              className='rounded-circle avatar-sm mb-3 object-fit-cover text-center'
            />
            {aApp.createdBy?.firstName} {aApp.createdBy?.lastName}
          </div>
        </td>
        <td className='text-center align-middle'>{aApp.loanAmount}</td>
        <td className='text-center align-middle'>{aApp.loanTerm}</td>
        <td className='text-center align-middle'>
          {aApp.preferredInterestRate}
        </td>
        <td className='text-center align-middle'>{aApp.creditScore}</td>
        <td className='text-center align-middle'>{aApp.loanType.name}</td>
        <td className='text-center align-middle'>{aApp.statusType.name}</td>
        <td className='text-center align-middle'>
          {aApp.isBusiness ? <CheckCircle size={20} /> : <XCircle size={20} />}
        </td>

        <td className='text-center align-middle'>
          <Button variant='btn btn-primary btn-xs' onClick={onViewMore}>
            View More
          </Button>
        </td>
      </tr>
    </React.Fragment>
  );
}

LoanAppCardTemplate.propTypes = {
  app: PropTypes.shape({
    id: PropTypes.number.isRequired,
    loanType: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    loanAmount: PropTypes.number.isRequired,
    loanTerm: PropTypes.number.isRequired,
    preferredInterestRate: PropTypes.number.isRequired,
    creditScore: PropTypes.number.isRequired,
    statusType: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    isBusiness: PropTypes.bool.isRequired,
    businessProfile: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      ein: PropTypes.number,
      statusType: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
      }),
      businessType: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
      }),
      industryType: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
      }),
      projectedAnnualBusinessIncome: PropTypes.number,
      annualBusinessIncome: PropTypes.number,
      businessStage: PropTypes.shape({
        value: PropTypes.number,
        id: PropTypes.number,
        name: PropTypes.string,
      }),
      logo: PropTypes.string,
      location: PropTypes.shape({
        id: PropTypes.number.isRequired,
        locationType: PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
        }).isRequired,
        lineOne: PropTypes.string.isRequired,
        lineTwo: PropTypes.string,
        city: PropTypes.string.isRequired,
        zip: PropTypes.string.isRequired,
        state: PropTypes.shape({
          code: PropTypes.string.isRequired,
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
        }).isRequired,
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
        createdBy: PropTypes.number.isRequired,
        modifiedBy: PropTypes.number.isRequired,
        isDeleted: PropTypes.bool.isRequired,
      }),
      dateCreated: PropTypes.string,
      dateModified: PropTypes.string,
      userId: PropTypes.number,
    }),
    borrower: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        user: PropTypes.shape({
          id: PropTypes.number.isRequired,
          firstName: PropTypes.string.isRequired,
          lastName: PropTypes.string.isRequired,
          mi: PropTypes.string,
          avatarUrl: PropTypes.string.isRequired,
        }).isRequired,
        ssn: PropTypes.string.isRequired,
        statusTypes: PropTypes.shape({
          id: PropTypes.number,
          name: PropTypes.string,
        }),
        annualIncome: PropTypes.number.isRequired,
        location: PropTypes.shape({
          id: PropTypes.number.isRequired,
          typeId: PropTypes.number.isRequired,
          lineOne: PropTypes.string.isRequired,
          lineTwo: PropTypes.string,
          city: PropTypes.string.isRequired,
          zip: PropTypes.string.isRequired,
        }).isRequired,
        dateCreated: PropTypes.string,
        dateModified: PropTypes.string,
      })
    ),
    loanFiles: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        fileName: PropTypes.string.isRequired,
        fileUrl: PropTypes.string.isRequired,
        fileType: PropTypes.string.isRequired,
        dateCreated: PropTypes.string.isRequired,
        dateModified: PropTypes.string.isRequired,
        createdBy: PropTypes.number.isRequired,
        modifiedBy: PropTypes.number.isRequired,
      })
    ).isRequired,
    dateCreated: PropTypes.string.isRequired,
    dateModified: PropTypes.string.isRequired,
    createdBy: PropTypes.shape({
      id: PropTypes.number.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      mi: PropTypes.string,
      avatarUrl: PropTypes.string.isRequired,
    }).isRequired,
    modifiedBy: PropTypes.shape({
      id: PropTypes.number.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      mi: PropTypes.string,
      avatarUrl: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default LoanAppCardTemplate;
