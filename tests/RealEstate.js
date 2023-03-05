const { expect } = require('chai');
const { ethers } = requuire('hardhat');

const tokens = (n) => {
    return ethers.utils.paseUnits(n.toString(), 'ether')
    }

    const ether = tokens

describe('RealEstate'), () => {
    let realEstate, escrow
    let deployer, seller
    let nftID = 1
    let purchasePrice = ether(100)
    let escrowAmount = ether(20)

    beforeEach(async () => {
        //Setup accounts
        accounts = await ethers.getSigners()
        deployer = accounts [0]
        seller = deployer
        buyer = accounts [1]
        inspector = accounts[2]
        lender = accounts[3]

        //Load contracts
        const RealEstate = await ethers.getContractFactory('RealEstate')
        const Escrow = await ethers.getContractFactory('Escrow')

        // Deploy contracts
        let RealEstate = await RealEstate.deploy()
        escrow = await Escrow.deploy()
        realEstate.address,
        nftID,
        purchasePrice,
        escrowAmount,
        seller.address,
        buyer.address,
        inspector.address,
        lender.address
        )

        // Seller Approves NFT
        transaction = await realEstate.connect(seller).approve(escrow.address, nftID)
        await transaction.wait()

    })


    describe('Deployment', async () => {

        it('sends an NFT to the seller/deployer', async () => {
            expect(await realEstate.ownerOf(nftID)).to.equal(seller.address)
        })
    })


  describe('Selling real estate', async () => {
      let balance, transaction

        it('executes a successful transaction', async () => {
        // Expects seller to be NFT owner before the sale
        expect(await realEstate.ownerOf(nftID)).to.equal(seller.address)
        
        // buyer deposits earnest
        transaction = await escrow.connect(buyer).depositEarnest({ value : escrowAmount})
        
        // Check escrow balance
        balance = await escrow.getBalance()
        console.log("escrow balance", ethers.utils.formatEther(balance))

        // Inspctor updates status
        transaction = await escrow.connect(inspector).updateInspectionStatus(true)
        await transaction.wait()
        console.log("Inspector updates status")

        // Buyer Approves sale
        transation = await escrow.connect(buyer).approveSale()
        await transaction.wait()
        console.log("buyer approves sale")

        // Seller approves sale
        transation = await escrow.connect(seller).approveSale()
        await transaction.wait()
        console.log("Buyer approves sale")

        // Lender funds sale
        transaction = await lender.sendTransaction ({ to: escrow.address, value: ether(80) })

        // Lender approves sale
        transaction = await escrow.connect(buyer).finalizeSale()
        await transaction.wait()
        console.log("Lender approves sale")

        //finalize sale
        transaction = await escrow.connect(buyer).finalizeSale()
        await transaction.wait()
        console.log ("Buyer finalizes sale")

        // Expects buyer to be NFT owner after the sale
            expect(await realEstate.ownerOf(nftID)).to.equal(buyer.address)

        // Expect seller to receive funds
        balance = await ethers.provider.getBalance(seller.address)
        console.log("Seller balance:", ethers.utils.formatEthers(balance))
        expect(balance).to.be.above(ether(10099))
        })
    })

})

