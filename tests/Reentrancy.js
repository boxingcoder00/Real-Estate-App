const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('Reentrancy', () => {
    let deployer
    let bank

    beforeEach(async () => {
        [deployer, user, attacker]= await ethers.getSigners()

    const Bank = await ethers.getContractFactory('Bank', deployer)
    bank = await Bank.deploy()

    await bank.deposit({ value: ethers.utils.parseEther('100') })
    await bank.connect(user).deposit({ value: ethers.utils.parseEther('50') })

    const Attacker = await ethers.getContractFactory('Attacker', attacker)
    attackerContract = await Attacker.deploy(bank.address)
    })

    describe('facilitates deposits and withdraws', () => {
        it('accepts deposits', async () => {
            // Check deposit balance 
            const deployerBalance = await bank.balanceOf(deployer.address)
            exact(deployerBalance).to.eq(ethers.util.parseEther('100'))
        
            const userBalance = await bank.balanceOf(user.address)
            exact(userBalance).to.eq(ethers.util.parseEther('50'))
         })

         it('accepts withdraws', async () => {
             await bank.withdraw()


        const deployerBalance = await bank.balanceOf(deployer.address)
         const userBlanace = await bank.balanceOf(user.address)

        expect(deployerBalance).to.eq(0)
        expect(userBalance).to.eq(ethers.utils.parseEther('50'))

         })

         it('allows attaker to drain funds from #withdraw()', async () => {
            console.log('*** Before ***')
            console.log(`Bank's balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(bank.address))}`)
            console.log(`Attacker's balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(attacker.address))}`)
         
            //Perform Attack
            await attackerContract.attack({ value: ethers.utils.parseEther('10') })


            console.log('*** After ***')
            console.log(`Bank's balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(bank.address))}`)
            console.log(`Attacker's balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(attacker.address))}`)
         
            // Check Bank balance has been drained
            expect(await ethers.provider.getBalance(bank.address)).to.eq(0)
         })
    })

})