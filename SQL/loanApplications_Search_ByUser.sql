USE [MoneFi]
GO
/****** Object:  StoredProcedure [dbo].[LoanApplications_Search_ByUser]    Script Date: 8/21/2023 8:53:00 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Elijah Douglas
-- Create date: 06/26/2023
-- Description: Search by User first or last Name for Loan Applications
-- Code Reviewer: 

-- MODIFIED BY:
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

ALTER proc [dbo].[LoanApplications_Search_ByUser]
							@Query NVARCHAR(500),
							@PageIndex INT,
							@PageSize INT
AS

/*

		Declare 
			@Query nvarchar = 'y'
			,@PageIndex int = 0
	        ,@PageSize int = 500


	Execute dbo.LoanApplications_Search_ByUser
									@Query
									,@PageIndex
									,@PageSize



*/
BEGIN

	DECLARE @Offset INT = @PageIndex * @PageSize;

	with LoansApplicationsCTE as (
	SELECT DISTINCT
        la.[Id],

        lt.[Id] AS LoanTypeId,
        lt.[Name] AS LoanTypeName,
        lt.[Description],

        la.[LoanAmount],
        la.[LoanTerm],
        la.[PreferredInterestRate],
        la.[CreditScore],

        st.[Id] AS StatusId,
        st.[Name] AS StatusName,

        la.[IsBusiness],
		BusinessProfile = CASE WHEN la.[IsBusiness] = 1 
	THEN((
		SELECT 
		BusinessProfiles.[Id],
		BusinessProfiles.[UserId],
		BusinessProfiles.[Name],
		BusinessProfiles.[EIN],
		BusinessProfiles.[ProjectedAnnualBusinessIncome],
		BusinessProfiles.[AnnualBusinessIncome],
		BusinessProfiles.[Logo],
		JSON_QUERY((
			SELECT
				[Id],
				[Name]
			FROM dbo.StatusTypes
			WHERE Id = BusinessProfiles.[StatusId]
			FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER
			)) as StatusType,
		JSON_QUERY ((
				SELECT 
					[Id],
					[Name]
				FROM dbo.BusinessTypes
				WHERE Id = BusinessProfiles.[BusinessTypeId]
				FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER
			)) as BusinessType,
		JSON_QUERY((
			SELECT
				[Id],
				[Name]
			FROM dbo.IndustryTypes
			WHERE Id = BusinessProfiles.[IndustryTypeId]
			FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER
			)) as IndustryType,
		JSON_QUERY((
			SELECT
				[Id],
				[Name],
				[Value]
			FROM dbo.BusinessStages
			WHERE Id = BusinessProfiles.[BusinessStageId]
			FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER
			)) as BusinessStage,
		JSON_QUERY((
			SELECT
				l.[Id] as 'id',
				lt.[Id] as 'LocationType.id',
				lt.[Name] as 'LocationType.name',
				l.[LineOne] as 'lineOne',
				l.[LineTwo] as 'lineTwo',
				l.[City] as 'city',
				l.[Zip] as 'zip',
				s.[Id] as 'State.id',
				s.[Name] as 'State.name',
				s.[Code] as 'State.code',
				l.[Latitude] as 'latitude',
				l.[Longitude] as 'longitude',
				l.[CreatedBy] as 'createdBy',
				l.[ModifiedBy] as 'modifiedBy',
				l.[IsDeleted] as 'isDeleted'
			FROM dbo.Locations as l
			JOIN dbo.LocationTypes as lt on lt.Id = l.LocationTypeId
			JOIN dbo.States as s on s.[Id] = l.[StateId]
			WHERE l.Id = BusinessProfiles.[LocationId]
			FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
		)) as Location,
		[DateCreated],
		[DateModified]
	FROM dbo.BusinessProfiles as BusinessProfiles 
	WHERE BusinessProfiles.[UserId] = la.[CreatedBy]
	FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER))
	ELSE(
		SELECT
			br.[Id],
			JSON_QUERY ((
			SELECT 
				u.[Id],
				u.[FirstName],
				u.[LastName],
				u.[Mi],
				u.[AvatarUrl]
			FROM dbo.Borrowers as br
			INNER JOIN dbo.[Users] as u on br.[UserId] = u.[Id]
			WHERE u.[Id] = la.[CreatedBy]
			FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER
			)) as [User], 
			br.[SSN], 
			JSON_QUERY((
			SELECT
				[Id],
				[Name]
			FROM dbo.[StatusTypes]
			WHERE [Id] = Borrowers.[StatusId]
			FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER
		)) as StatusTypes,
			br.[AnnualIncome],
			JSON_QUERY((
			SELECT
					l.[Id] as 'id',
					lt.Id as 'TypeId',
					l.[LineOne] as 'lineOne',
					l.[LineTwo] as 'lineTwo',
					l.[City]as 'city' , 
					l.[Zip] as 'zip',
					l.[DateCreated] as 'dateCreated',
					l.[DateModified] as 'dateModified'
			FROM dbo.Locations as l
			JOIN dbo.LocationTypes as lt on lt.Id = l.LocationTypeId
			WHERE l.Id = Borrowers.[LocationId]
			FOR JSON path, WITHOUT_ARRAY_WRAPPER
		)) as [Location],
		br.DateCreated,
		br.DateModified
		FROM dbo.Borrowers as br
		WHERE br.[UserId] = la.[CreatedBy]
		FOR JSON AUTO
	)END,
    LoanFiles = (
    SELECT
        f.[Id],
        f.[Name] as [fileName],
        f.[Url] as [fileUrl],
		lft.[Name] as [fileType],
		f.DateCreated,
		f.CreatedBy
    FROM dbo.Files AS f
    INNER JOIN LoanFiles AS lf ON f.Id = lf.[FileId]
	INNER JOIN dbo.LoanFileTypes AS lft on lf.[LoanFileTypeId] = lft.[Id]
    WHERE lf.[LoanId] = la.[Id]
    FOR JSON PATH
	),

        la.[DateCreated],
        la.[DateModified],

        CreatedBy = dbo.fn_GetUserJson(la.CreatedBy),
        ModifiedBy = dbo.fn_GetUserJson(la.ModifiedBy)

       
		
	FROM dbo.LoanApplications la
    INNER JOIN dbo.LoanTypes lt ON la.LoanTypeId = lt.[Id]
    INNER JOIN dbo.StatusTypes st ON la.StatusId = st.[Id]
    INNER JOIN dbo.LoanFiles lf ON la.Id = lf.[LoanId]
	INNER JOIN dbo.Users as u on la.CreatedBy = u.[Id]
	INNER JOIN dbo.Borrowers as Borrowers ON u.[id] = Borrowers.[UserId]
	 WHERE u.FirstName LIKE '%' + @Query + '%' OR u.LastName LIKE '%' + @Query + '%'
	)

	Select 
		[Id]
		,[LoanTypeId]
		,[LoanTypeName]
		,[Description]
		,[LoanAmount]
		,[LoanTerm]
		,[PreferredInterestRate]
		,[CreditScore]
		,[StatusId]
		,[StatusName]
		,[isBusiness]
		,[BusinessProfile]
		,[LoanFiles]
		,[DateCreated]
		,[DateModified]
		,[ModifiedBy]
		,[CreatedBy]
		,(Count(*) over()) as Total
	from LoansApplicationsCTE

    ORDER BY Id
    OFFSET @Offset ROWS 
    FETCH NEXT @PageSize ROWS ONLY;
END


