const TheoDoi = artifacts.require("TheoDoi");

contract("TheoDoi", (accounts) => {
    let theoDoiInstance;

    before(async () => {
        theoDoiInstance = await TheoDoi.deployed();
    });

    it("should create a new product", async () => {
        const id = "SP001";
        const data = "Product Data 1";

        await theoDoiInstance.taoSP(id, data);

        const sp = await theoDoiInstance.sanPhams(id);
        assert.equal(sp.id, id, "Product ID does not match");
        assert.equal(sp.data, data, "Product data does not match");
    });

    it("should update product status", async () => {
        const id = "SP001";
        const data = "Status Update 1";

        await theoDoiInstance.capNhat(id, data);

        const lichSu = await theoDoiInstance.xemLichSu(id);
        assert.equal(lichSu.length, 1, "Status history length is not correct");
        assert.equal(lichSu[0].data, data, "Status data does not match");
    });

    it("should not create a product with an existing ID", async () => {
        const id = "SP001";
        const data = "Product Data 2";

        try {
            await theoDoiInstance.taoSP(id, data);
            assert.fail("Expected error was not received");
        } catch (error) {
            assert.include(error.message, "revert", "Expected revert error, got another error");
        }
    });

    it("should return the correct list of products", async () => {
        const id1 = "SP002";
        const data1 = "Product Data 2";
        const id2 = "SP003";
        const data2 = "Product Data 3";

        await theoDoiInstance.taoSP(id1, data1);
        await theoDoiInstance.taoSP(id2, data2);

        const products = await theoDoiInstance.laySP();

        assert.equal(products.length, 3, "Product list length is incorrect");
        assert.equal(products[1].id, id1, "Second product ID does not match");
        assert.equal(products[2].id, id2, "Third product ID does not match");
    });
});
